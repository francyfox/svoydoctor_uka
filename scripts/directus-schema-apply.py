#!/usr/bin/env python3
"""Apply a declarative block-schema spec (JSON) to this project's Directus instance.

Usage: python3 scripts/directus-schema-apply.py docs/global/blocks/<name>.json

Spec shape:
{
  "delete_collections": [ "collection_name", ... ],   // applied FIRST, cascades fields/relations
  "collections": [ { "collection": "...", "meta": {...}, "schema": {}, "fields": [ {...} ] } ],
  "relations": [ { "collection": "...", "field": "...", "related_collection": "...", "meta": {...}, "schema": {...} } ],
  "alias_fields": [ { "collection": "...", "field": "...", "type": "alias", "meta": {...}, "schema": null } ],
  "groups": [ { "collection": "...", "group": "parent_collection_name" } ]  // admin-sidebar nesting only, no schema effect
}

Applies collections first (each with its own inline non-alias fields), then relations,
then alias fields (list-o2m / list-m2a / translations / m2a "item" fields need the
underlying relation to exist first). Re-fetches every field write to confirm `meta.special`
persisted, per the known create-field/update-field bug documented in the directus skill.
Prints one line per step — ok or the raw error — never dumps full response bodies, to keep
this cheap to read back into an agent's context.
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


def request(base_url, token, method, path, body=None):
    url = f"{base_url}{path}"
    data = json.dumps(body).encode() if body is not None else None
    req = urllib.request.Request(url, data=data, method=method)
    req.add_header("Authorization", f"Bearer {token}")
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


def main():
    if len(sys.argv) != 2:
        print("usage: directus-schema-apply.py <spec.json>")
        sys.exit(1)

    e = env()
    base_url, token = e["DIRECTUS_URL"], e.get("DIRECTUS_ADMIN_TOKEN") or e["DIRECTUS_TOKEN"]

    with open(sys.argv[1]) as f:
        spec = json.load(f)

    ok_count = 0
    fail_count = 0

    def step(label, method, path, body=None):
        nonlocal ok_count, fail_count
        status, resp = request(base_url, token, method, path, body)
        if 200 <= status < 300:
            ok_count += 1
            print(f"  ok   {label}")
        else:
            fail_count += 1
            err = resp.get("errors", resp) if isinstance(resp, dict) else resp
            print(f"  FAIL {label} -> {status} {err}")

    for name in spec.get("delete_collections", []):
        step(f"delete collection {name}", "DELETE", f"/collections/{name}")

    for c in spec.get("collections", []):
        step(f"collection {c['collection']}", "POST", "/collections", c)

    for r in spec.get("relations", []):
        step(f"relation {r['collection']}.{r['field']}", "POST", "/relations", r)

    for a in spec.get("alias_fields", []):
        coll = a["collection"]
        field = {k: v for k, v in a.items() if k != "collection"}
        step(f"alias field {coll}.{a['field']}", "POST", f"/fields/{coll}", field)
        # verify meta.special actually persisted (known MCP/create-field bug; raw REST
        # is generally reliable but we verify anyway since this is the whole point).
        status, resp = request(base_url, token, "GET", f"/fields/{coll}/{a['field']}")
        got_special = (resp or {}).get("data", {}).get("meta", {}).get("special")
        want_special = a.get("meta", {}).get("special")
        if got_special != want_special:
            fail_count += 1
            print(f"  FAIL {coll}.{a['field']} special mismatch: got {got_special}, want {want_special}")

    for g in spec.get("groups", []):
        step(f"group {g['collection']} -> {g['group']}", "PATCH", f"/collections/{g['collection']}",
             {"meta": {"group": g["group"]}})

    print(f"\n{ok_count} ok, {fail_count} failed")
    sys.exit(1 if fail_count else 0)


if __name__ == "__main__":
    main()
