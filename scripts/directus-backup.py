#!/usr/bin/env python3
"""Full content + schema backup of this project's Directus instance.

Usage: python3 scripts/directus-backup.py

No direct Postgres/Neon connection is configured in .env (API-only access), so this
does the next best thing: dumps every non-system collection's items (raw REST,
limit=-1 for "all rows") plus a fresh schema snapshot, into a timestamped folder
under backups/. Restoring: schema via `directus schema apply`, content via
`POST /items/:collection` per file (batch-create supports an array body).
"""

import json
import os
import sys
import urllib.request
import urllib.error
from datetime import datetime, timezone


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


def get(base_url, token, path):
    req = urllib.request.Request(f"{base_url}{path}", method="GET")
    req.add_header("Authorization", f"Bearer {token}")
    try:
        with urllib.request.urlopen(req) as resp:
            return json.loads(resp.read())
    except urllib.error.HTTPError as e:
        return {"errors": [{"status": e.code, "body": e.read().decode(errors='replace')}]}


def main():
    e = env()
    base_url, token = e["DIRECTUS_URL"], e.get("DIRECTUS_ADMIN_TOKEN") or e["DIRECTUS_TOKEN"]

    ts = datetime.now(timezone.utc).strftime("%Y%m%dT%H%M%SZ")
    out_dir = os.path.join(os.path.dirname(__file__), "..", "backups", ts)
    os.makedirs(out_dir, exist_ok=True)
    os.makedirs(os.path.join(out_dir, "items"), exist_ok=True)

    print(f"Backing up to backups/{ts}/")

    snapshot = get(base_url, token, "/schema/snapshot")
    with open(os.path.join(out_dir, "schema-snapshot.json"), "w") as f:
        json.dump(snapshot, f, indent=2, ensure_ascii=False, sort_keys=True)
    print("  ok   schema-snapshot.json")

    collections = snapshot["data"]["collections"]
    names = sorted(
        c["collection"] for c in collections
        if not c["collection"].startswith("directus_")
        and c.get("schema") is not None  # skip pure nav folders (no real table)
    )

    for name in names:
        data = get(base_url, token, f"/items/{name}?limit=-1")
        if "errors" in data:
            print(f"  FAIL {name}: {data['errors']}")
            continue
        rows = data.get("data", [])
        with open(os.path.join(out_dir, "items", f"{name}.json"), "w") as f:
            json.dump(rows, f, indent=2, ensure_ascii=False, sort_keys=True)
        print(f"  ok   {name} ({len(rows)} rows)")

    print(f"\nBackup complete: backups/{ts}/")


if __name__ == "__main__":
    main()
