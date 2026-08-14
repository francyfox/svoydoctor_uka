#!/usr/bin/env python3
"""Migrate real content from the old section_* model into the new
pages -> section_* (M2A) -> block_* (M2A) structure. Supersedes migrate-content.py
(which built the wrong, now-deleted, 2-tier "block_*"-as-section model).

Source: the latest backup (old section_* rows, taken before this session's cleanup).
Usage: python3 scripts/migrate-content-v2.py
"""

import json
import os
import sys
import glob
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

# Use the backup taken BEFORE cleanup (has old section_* content), not the one after.
BACKUP_DIR = "/home/fox/WebstormProjects/svoydoctor_uka/backups/20260814T091341Z"
print(f"Reading source content from {BACKUP_DIR}")


def load(name):
    with open(os.path.join(BACKUP_DIR, "items", f"{name}.json")) as f:
        return json.load(f)


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


def post_item(collection, item):
    status, resp = request("POST", f"/items/{collection}", item)
    if not (200 <= status < 300):
        print(f"  FAIL POST /items/{collection}: {status} {resp}")
        sys.exit(1)
    return resp["data"]


def guard_empty(collection):
    status, resp = request("GET", f"/items/{collection}?limit=1")
    if resp and resp.get("data"):
        print(f"SKIP: {collection} already has content — refusing to duplicate.")
        sys.exit(1)


ROLE_BY_SORT = {1: "title", 2: "photo", 3: "promo", 4: "spare", 5: "media"}


# ---------------------------------------------------------------- hero -----
def migrate_hero():
    print("\n=== hero ===")
    guard_empty("section_hero")

    old_t = {t["languages_code"]: t for t in load("section_hero_translations")}
    old_blocks = {b["id"]: b for b in load("section_hero_block")}
    old_adv = {a["id"]: a for a in load("section_hero_advantage")}
    old_links = {l["id"]: l for l in load("section_hero_link")}

    sh = post_item("section_hero", {"key": "hero-main"})
    print(f"  ok   section_hero id={sh['id']}")

    titles = {"ru": "Главный экран", "kk": "Басты экран"}
    for lang, old in old_t.items():
        t = post_item("section_hero_translations", {
            "section_hero_id": sh["id"], "languages_code": lang, "title": titles[lang], "description": None,
        })
        print(f"  ok   section_hero_translations[{lang}] id={t['id']}")

        for bid in old["blocks"]:
            b = old_blocks[bid]
            card = post_item("block_media_card", {
                "key": f"hero-tile-{lang}-{bid}", "title": b["title"], "description": b["description"],
                "media": b["media"], "href": b["link"],
            })
            role = ROLE_BY_SORT[b["sort"]]
            post_item("section_hero_tile", {
                "ref_id": t["id"], "sort": b["sort"], "role": role,
                "collection": "block_media_card", "item": str(card["id"]),
            })
        print(f"  ok   section_hero_tile[{lang}] x{len(old['blocks'])}")

        for aid in old["advantages"]:
            a = old_adv[aid]
            icon = post_item("block_icon_label", {"key": f"hero-adv-{lang}-{aid}", "icon": a["icon"], "label": a["text"]})
            post_item("section_hero_advantage", {
                "ref_id": t["id"], "sort": a["sort"], "collection": "block_icon_label", "item": str(icon["id"]),
            })
        print(f"  ok   section_hero_advantage[{lang}] x{len(old['advantages'])}")

        for lid in old["links"]:
            l = old_links[lid]
            link = post_item("block_link", {"key": f"hero-link-{lang}-{lid}", "label": l["label"], "href": l["href"]})
            post_item("section_hero_link", {
                "ref_id": t["id"], "sort": l["sort"], "collection": "block_link", "item": str(link["id"]),
            })
        print(f"  ok   section_hero_link[{lang}] x{len(old['links'])}")

    return sh["id"]


# ------------------------------------------------------------ services -----
def migrate_services():
    print("\n=== services ===")
    guard_empty("section_services")

    old_t = {t["languages_code"]: t for t in load("section_services_translations")}
    old_items = {i["id"]: i for i in load("section_services_item")}

    ss = post_item("section_services", {"key": "services-main"})
    print(f"  ok   section_services id={ss['id']}")

    for lang, old in old_t.items():
        t = post_item("section_services_translations", {
            "section_services_id": ss["id"], "languages_code": lang, "title": old["title"], "description": None,
        })
        print(f"  ok   section_services_translations[{lang}] id={t['id']}")

        for iid in old["items"]:
            it = old_items[iid]
            card = post_item("block_media_card", {
                "key": f"services-{lang}-{iid}", "title": it["label"], "description": it["description"],
                "media": it["illustration"], "href": None,
            })
            post_item("section_services_item", {
                "ref_id": t["id"], "sort": it["sort"], "collection": "block_media_card", "item": str(card["id"]),
                "cta_label": it["cta_label"],
            })
        print(f"  ok   section_services_item[{lang}] x{len(old['items'])}")

    return ss["id"]


# ------------------------------------------------------------ symptoms -----
def migrate_symptoms():
    print("\n=== symptoms ===")
    guard_empty("section_symptoms")

    old = load("section_symptoms")
    old_t = {t["languages_code"]: t for t in load("section_symptoms_translations")}
    old_symptoms = {s["id"]: s for s in load("section_symptom")}

    ssy = post_item("section_symptoms", {
        "key": "symptoms-main",
        "slider_autoplay": old["slider_autoplay"], "slider_speed": old["slider_speed"], "slider_interval": old["slider_interval"],
        "cat_icon": old["cat_icon"], "dog_icon": old["dog_icon"],
    })
    print(f"  ok   section_symptoms id={ssy['id']}")

    for lang, o in old_t.items():
        t = post_item("section_symptoms_translations", {
            "section_symptoms_id": ssy["id"], "languages_code": lang, "title": o["title"], "description": None,
            "subtitle": o["subtitle"], "cat_label": o["cat_label"], "dog_label": o["dog_label"],
        })
        print(f"  ok   section_symptoms_translations[{lang}] id={t['id']}")

        items = [
            {"ref_id": t["id"], "sort": idx, "text": old_symptoms[sid]["text"], "species": old_symptoms[sid]["species"]}
            for idx, sid in enumerate(o["symptoms"])
        ]
        status, resp = request("POST", "/items/section_symptom", items)
        if not (200 <= status < 300):
            print(f"  FAIL section_symptom[{lang}]: {status} {resp}")
            sys.exit(1)
        print(f"  ok   section_symptom[{lang}] x{len(items)}")

    return ssy["id"]


# ------------------------------------------------------------ we_help ------
def migrate_we_help():
    print("\n=== we_help ===")
    guard_empty("section_we_help")

    old = load("section_we_help")
    old_t = {t["languages_code"]: t for t in load("section_we_help_translations")}
    old_items = {i["id"]: i for i in load("section_we_help_item")}

    swh = post_item("section_we_help", {
        "key": "we-help-main",
        "slider_autoplay": old["slider_autoplay"], "slider_speed": old["slider_speed"], "slider_interval": old["slider_interval"],
    })
    print(f"  ok   section_we_help id={swh['id']}")

    for lang, o in old_t.items():
        t = post_item("section_we_help_translations", {
            "section_we_help_id": swh["id"], "languages_code": lang, "title": o["title"], "description": None,
        })
        print(f"  ok   section_we_help_translations[{lang}] id={t['id']}")

        for idx, iid in enumerate(o["items"]):
            it = old_items[iid]
            card = post_item("block_media_card", {
                "key": f"we-help-{lang}-{iid}", "title": it["title"], "description": it["description"],
                "media": it["photo"], "href": it["link"] or None,
            })
            post_item("section_we_help_item", {
                "ref_id": t["id"], "sort": idx, "collection": "block_media_card", "item": str(card["id"]),
                "featured": it["featured"],
            })
        print(f"  ok   section_we_help_item[{lang}] x{len(o['items'])}")

    return swh["id"]


# ------------------------------------------------------------ contacts -----
def migrate_contacts():
    print("\n=== contacts (thin marker) ===")
    guard_empty("section_contacts")

    sc = post_item("section_contacts", {"key": "contacts-main"})
    print(f"  ok   section_contacts id={sc['id']}")

    titles = {"ru": "Контакты", "kk": "Байланыс"}
    for lang, title in titles.items():
        t = post_item("section_contacts_translations", {
            "section_contacts_id": sc["id"], "languages_code": lang, "title": title, "description": None,
        })
        print(f"  ok   section_contacts_translations[{lang}] id={t['id']}")

    return sc["id"]


# ------------------------------------------------------------ page_sections
def link_page_sections(hero_id, services_id, symptoms_id, we_help_id, contacts_id):
    print("\n=== page_sections ===")
    guard_empty("page_sections")

    rows = [
        {"page": 1, "sort": 1, "collection": "section_hero", "item": str(hero_id)},
        {"page": 1, "sort": 2, "collection": "section_services", "item": str(services_id)},
        {"page": 1, "sort": 3, "collection": "section_symptoms", "item": str(symptoms_id)},
        {"page": 1, "sort": 4, "collection": "section_we_help", "item": str(we_help_id)},
        {"page": 1, "sort": 5, "collection": "section_contacts", "item": str(contacts_id)},
    ]
    status, resp = request("POST", "/items/page_sections", rows)
    if not (200 <= status < 300):
        print(f"  FAIL page_sections: {status} {resp}")
        sys.exit(1)
    print(f"  ok   page_sections x{len(rows)}")


if __name__ == "__main__":
    hero_id = migrate_hero()
    services_id = migrate_services()
    symptoms_id = migrate_symptoms()
    we_help_id = migrate_we_help()
    contacts_id = migrate_contacts()
    link_page_sections(hero_id, services_id, symptoms_id, we_help_id, contacts_id)
    print("\nDone.")
