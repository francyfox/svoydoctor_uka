#!/usr/bin/env python3
"""Migrate page_meta -> pages, and page_services -> sections on a new 'services' page.
Read-then-write against the LIVE instance (small, known content) rather than a backup file,
since this migration also needs to retarget the existing service_price_category rows.
"""

import json
import os
import sys
import urllib.request
import urllib.error


def env():
    path = os.path.join(os.path.dirname(__file__), "..", ".env")
    out = {}
    with open(path) as f:
        for line in f:
            line = line.strip()
            if not line or line.startswith("#") or "=" not in line:
                continue
            k, v = line.split("=", 1)
            out[k] = v.strip().strip('"').strip("'")
    return out


E = env()
BASE, TOKEN = E["DIRECTUS_URL"], E.get("DIRECTUS_ADMIN_TOKEN") or E["DIRECTUS_TOKEN"]


def request(method, path, body=None):
    url = f"{BASE}{path}"
    data = json.dumps(body).encode() if body is not None else None
    req = urllib.request.Request(url, data=data, method=method)
    req.add_header("Authorization", f"Bearer {TOKEN}")
    req.add_header("Content-Type", "application/json")
    try:
        with urllib.request.urlopen(req) as resp:
            raw = resp.read()
            return resp.status, (json.loads(raw) if raw else None)
    except urllib.error.HTTPError as e:
        raw = e.read()
        try:
            return e.code, json.loads(raw)
        except Exception:
            return e.code, {"raw": raw.decode(errors="replace")}


def ok(label, status, resp):
    if not (200 <= status < 300):
        print(f"  FAIL {label}: {status} {resp}")
        sys.exit(1)
    print(f"  ok   {label}")
    return resp["data"] if resp else None


def get(path):
    status, resp = request("GET", path)
    if not (200 <= status < 300):
        print(f"  FAIL GET {path}: {status} {resp}")
        sys.exit(1)
    return resp["data"]


# ------------------------------------------------------------ page_meta -> pages
def migrate_page_meta():
    print("\n=== page_meta -> pages ===")
    metas = get("/items/page_meta?fields=id,route,noindex,translations.languages_code,translations.meta_title")
    pages = {p["key"]: p for p in get("/items/pages?fields=id,key")}

    for m in metas:
        route = m["route"]
        if route in pages:
            page_id = pages[route]["id"]
        else:
            page = ok(f"pages create {route}", *request("POST", "/items/pages", {"key": route, "status": "published", "show_in_menu": True}))
            page_id = page["id"]
        ok(f"pages update {route} noindex", *request("PATCH", f"/items/pages/{page_id}", {"noindex": m["noindex"]}))

        for t in m["translations"]:
            lang = t["languages_code"]
            existing = get(f"/items/pages_translations?filter[page_id][_eq]={page_id}&filter[languages_code][_eq]={lang}")
            if existing:
                ok(f"pages_translations update {route}[{lang}]", *request(
                    "PATCH", f"/items/pages_translations/{existing[0]['id']}", {"title": t["meta_title"]}))
            else:
                ok(f"pages_translations create {route}[{lang}]", *request(
                    "POST", "/items/pages_translations", {"page_id": page_id, "languages_code": lang, "title": t["meta_title"]}))

    return {p["route"]: (pages.get(p["route"], {}).get("id")) for p in metas}


def get_or_create_page(key):
    existing = get(f"/items/pages?filter[key][_eq]={key}")
    if existing:
        return existing[0]["id"]
    page = ok(f"pages create {key}", *request("POST", "/items/pages", {"key": key, "status": "published", "show_in_menu": True}))
    return page["id"]


# --------------------------------------------------- page_services -> sections
def migrate_page_services(services_page_id):
    print("\n=== page_services -> sections ===")
    old = get("/items/page_services?fields=id,promo_enabled,promo_price,promo_original_price,promo_valid_until")
    old_t = {t["languages_code"]: t for t in get(
        "/items/page_services_translations?fields=id,languages_code,intro_title,intro_description,promo_title,promo_description,price_list_title,price_note"
    )}

    # --- section_blocks (intro text, zero items) ---
    sb = ok("section_blocks create", *request("POST", "/items/section_blocks", {"key": "services-intro"}))
    for lang, t in old_t.items():
        ok(f"section_blocks_translations[{lang}]", *request("POST", "/items/section_blocks_translations", {
            "section_blocks_id": sb["id"], "languages_code": lang, "title": t["intro_title"], "description": t["intro_description"],
        }))

    # --- section_services_promo ---
    sp = ok("section_services_promo create", *request("POST", "/items/section_services_promo", {
        "key": "services-promo", "enabled": old["promo_enabled"], "price": old["promo_price"],
        "original_price": old["promo_original_price"], "valid_until": old["promo_valid_until"],
    }))
    for lang, t in old_t.items():
        ok(f"section_services_promo_translations[{lang}]", *request("POST", "/items/section_services_promo_translations", {
            "section_services_promo_id": sp["id"], "languages_code": lang, "title": t["promo_title"], "description": t["promo_description"],
        }))

    # --- section_services_pricelist ---
    spl = ok("section_services_pricelist create", *request("POST", "/items/section_services_pricelist", {"key": "services-pricelist"}))
    pricelist_translation_ids = {}
    for lang, t in old_t.items():
        row = ok(f"section_services_pricelist_translations[{lang}]", *request("POST", "/items/section_services_pricelist_translations", {
            "section_services_pricelist_id": spl["id"], "languages_code": lang, "title": t["price_list_title"], "note": t["price_note"],
        }))
        pricelist_translation_ids[t["id"]] = row["id"]  # old page_services_translations.id -> new pricelist_translations.id

    # --- re-point service_price_category.ref_id from old page_services_translations ids to new ones ---
    categories = get("/items/service_price_category?fields=id,ref_id")
    for cat in categories:
        new_ref = pricelist_translation_ids.get(cat["ref_id"])
        if new_ref:
            ok(f"service_price_category {cat['id']} ref_id -> {new_ref}", *request(
                "PATCH", f"/items/service_price_category/{cat['id']}", {"ref_id": new_ref}))

    # --- re-add the FK relation now that data is consistent ---
    status, resp = request("POST", "/relations", {
        "collection": "service_price_category", "field": "ref_id", "related_collection": "section_services_pricelist_translations",
        "meta": {"one_field": "categories", "sort_field": "sort", "one_deselect_action": "nullify"},
        "schema": {"on_delete": "SET NULL"},
    })
    ok("service_price_category.ref_id relation re-created", status, resp)

    # --- attach section_services (existing homepage grid instance) + the 3 new sections to the services page ---
    existing_services_section = get("/items/section_services?fields=id")[0]["id"]
    rows = [
        {"page": services_page_id, "sort": 1, "collection": "section_blocks", "item": str(sb["id"])},
        {"page": services_page_id, "sort": 2, "collection": "section_services", "item": str(existing_services_section)},
        {"page": services_page_id, "sort": 3, "collection": "section_services_promo", "item": str(sp["id"])},
        {"page": services_page_id, "sort": 4, "collection": "section_services_pricelist", "item": str(spl["id"])},
    ]
    ok("page_sections (services)", *request("POST", "/items/page_sections", rows))


# ---------------------------------------------------------------- cleanup ---
def delete_old_collections():
    print("\n=== deleting old page_meta / page_services collections ===")
    for coll in ["page_meta_translations", "page_meta", "page_services_translations", "page_services"]:
        status, resp = request("DELETE", f"/collections/{coll}")
        if 200 <= status < 300:
            print(f"  ok   delete {coll}")
        else:
            print(f"  FAIL delete {coll}: {status} {resp}")


if __name__ == "__main__":
    migrate_page_meta()
    services_page_id = get_or_create_page("services")
    migrate_page_services(services_page_id)
    delete_old_collections()
    print("\nDone.")
