---
name: directus
description: "Load whenever creating/editing Directus collections, fields, relations, or content-model layout (tabs/groups/accordions) in this project's Directus instance — via `mcp__directus__*` tools or direct REST. Triggers: 'добавь поле в Directus', 'сгруппируй поля', 'создай коллекцию', field/relation creation, singleton-collection edits, anything mentioning Directus schema work. Covers which `mcp__directus__*` methods are known-buggy on this instance and the verified recipe for field-grouping UI (tabs/raw-group/detail-group)."
disable-model-invocation: false
---

# Directus schema work on this project

Instance: `https://directus-11-17-4.onrender.com` (Render + Neon Postgres + R2). **Single instance, no staging** — every schema/content change below goes straight to prod. `.env` has `DIRECTUS_URL`/`DIRECTUS_TOKEN` for raw REST calls (`curl -H "Authorization: Bearer $DIRECTUS_TOKEN"`).

PostGIS is enabled on the Neon DB (added 2026-08-12) — native `geometry`-type fields (e.g. `interface: "map"`, stores GeoJSON `{type:"Point",coordinates:[lng,lat]}`) now work. Before that, `type: "geometry"` field creation failed with `type "geometry" does not exist`.

## 1. Known-buggy `mcp__directus__*` methods — verified on this instance

| Tool | Bug | Workaround |
|---|---|---|
| `create-field` / `update-field` | Silently drops `meta.special` from the request — the field gets created/updated, but `special` comes back `null` even though you sent an array. Reproduced repeatedly (booleans, group-alias fields). | After every `create-field`/`update-field` call that sets `special`, **re-fetch the field** (`read-fields` or `GET /fields/:collection/:field`) to confirm it persisted. If not, `curl -X PATCH $DIRECTUS_URL/fields/:collection/:field -d '{"meta":{"special":[...]}}'` directly — raw REST PATCH persists it correctly every time. |
| `create-item` | Parameter is named `item`, not `data` (despite `data` being the intuitive/common name used by `update-item`'s partial-payload param). Passing `data` fails with `Invalid input: expected record, received undefined`. | Always pass `item: {...}`. |
| `update-item` | Doesn't work on **singleton** collections (e.g. `settings`) — it always builds `PATCH /:collection/:id`, but singletons only expose `PATCH /items/:collection` (no id in the URL, no `/items/` skipped). Fails with `Route /settings/1 doesn't exist`. | For singleton collections, always use raw REST: `curl -X PATCH $DIRECTUS_URL/items/:collection -d '{...}'`. `update-item` is fine for regular (non-singleton) collections. |
| *(all)* | None of the `mcp__directus__*` tools support creating/deleting **collections** or **relations** — only fields on an existing collection. | Use raw REST: `POST /collections` (can include `fields: [...]` inline in the same call), `POST /relations`, `DELETE /fields/:collection/:field`. |

General rule: **never trust an MCP write silently** — re-`read-fields`/`read-items` after any schema-affecting call before considering it done. This project got bitten twice by `special` not persisting (a boolean field once, a group field twice).

## 2. Field-grouping UI (tabs / raw groups / accordions) — verified recipe

Directus has no literal "edit this subset of fields in a modal" for plain scalar fields (that pattern only exists for O2M/M2O relations, where a drawer opens the *related item*, not a subset of the current record's own fields). The available field-organizing primitives are all **group fields** — alias-type fields with no backing DB column that other fields point to via `meta.group`:

| Interface | Renders as | `options` |
|---|---|---|
| `group-raw` | No visual boundary — just a logical cluster in the field-tree order | — |
| `group-detail` | Collapsible accordion box | `{"start": "closed"}` to default-collapsed |
| `group-tabs` | Tab strip — each **direct child that is itself a group** becomes one tab; a direct child that's a plain field becomes a tab too (single-field tab) | — |

**You can nest a `group-raw` (or `group-detail`) inside a `group-tabs`** to put multiple fields in one tab — this is the actual working pattern confirmed in this project's `settings` collection (`tabs-fg95w8` → contains `mapboxSettings`, a `group-raw` holding `mapbox_style_url` + `map`, plus `mapbox_token` sitting directly in the tab as its own single-field tab).

### The critical bug this project hit: wrong `special` makes the group vanish

A group field created with **`meta.special: ["group"]` alone is structurally valid and individually fetchable** (`GET /fields/:collection/:field` returns it fine) **but is silently excluded from both `GET /fields/:collection` and `GET /fields` (collection-wide and global listings)** — which means it never renders in the Directus admin's "Data Model" / field-layout screen at all, even after a hard browser refresh and a server-side `POST /utils/cache/clear`. Reproduced and fixed twice in this project.

**Fix — the `special` array must be exactly:**

```json
"special": ["alias", "no-data", "group"]
```

Not just `["group"]`. All three flags. Verified by direct A/B test on this instance: `["group"]` → field invisible in listings; `["alias", "no-data", "group"]` → field appears immediately.

### Minimal working payload for a new group field

```bash
curl -X POST "$DIRECTUS_URL/fields/settings" \
  -H "Authorization: Bearer $DIRECTUS_TOKEN" -H "Content-Type: application/json" \
  -d '{
    "field": "my_group",
    "type": "alias",
    "meta": {
      "special": ["alias", "no-data", "group"],
      "interface": "group-detail",
      "options": {"start": "closed"},
      "sort": 20
    },
    "schema": null
  }'
```

Because `create-field`/`update-field` (the MCP tools) drop `special`, creating group fields through them requires the same two-step dance as §1: create via MCP (or raw REST directly, skipping the dance entirely — simplest), then verify `special` actually landed.

### Attaching child fields to a group

```bash
curl -X PATCH "$DIRECTUS_URL/fields/settings/some_field" \
  -H "Authorization: Bearer $DIRECTUS_TOKEN" -H "Content-Type: application/json" \
  -d '{"meta": {"group": "my_group"}}'
```

`meta.group` takes the **group field's `field` name as a string** (e.g. `"my_group"`), not its numeric `id` — this is the real-world working behavior on this instance, confirmed by a live example. (Directus's own `oas.yaml` OpenAPI reference types `group` as `integer` with a self-contradictory `oneOf: [Fields]` — that stub looks like an auto-generation artifact, not authoritative; don't trust it over an actual working example.)

To nest a group inside a tab, set the nested group's own `meta.group` to the tabs field's name — same mechanism, one level deeper.

### Naming convention for group/tab container fields

Group fields are alias/no-data fields — their `field` name never appears as data anywhere (not in the API response, not in app code), so it's purely an internal label. Still, pick names deliberately so a future schema read is self-explanatory and nothing collides with a real content field added later:

- **Top-level tabs container**: `<collection>_tabs` — e.g. `settings_tabs` on the `settings` collection. One per collection, at most.
- **Each tab** (a `group-raw`/`group-detail` nested inside the tabs container): `tab_<purpose>`, short English snake_case describing what's inside — e.g. `tab_general`, `tab_map`, `tab_notices` (used on `settings`: general site info / Mapbox config / operational toggles). The user-visible tab label is separate — set via `meta.translations: [{"language": "ru-RU", "translation": "Карта"}]` on the tab field, not via its `field` name.
- **Standalone accordion group** (a `group-detail` NOT nested inside tabs): `group_<purpose>` — keeps it visually distinct from `tab_*` names when scanning a field list, since a bare `group-detail` renders differently (collapsible box, not a tab strip) from a `tab_*` nested one.
- Never reuse a purpose-word that's also a real scalar field name on the same collection (e.g. don't name a group `map` when a real `map` geometry field exists) — avoid ambiguity when skimming `read-fields` output.

### Reliability caveat: tabs may hang on save

The user observed the Directus admin **hang when saving** after using a `group-tabs` layout on this instance. Not confirmed to be a Directus bug specifically — this instance runs on Render.com free/low tier, which cold-starts and can stall on any request, tab-groups or not. If tabs prove flaky, prefer `group-detail` (accordion) or plain `group-raw` (no interaction, just visual clustering) — both are simpler and weren't observed to hang.

## 3. `list-o2m` fields show raw `id` by default — set a display template

Every O2M child-collection field (the repeatable-item pattern in §3 below — `blocks`, `advantages`, `links`, `items`, `symptoms`, etc.) uses `interface: "list-o2m"`. Left at `options: null`, Directus shows each collapsed row as its bare numeric `id` — useless for reordering/scanning a list of 20+ items. Fix by setting a Mustache-style template referencing the child collection's own text field:

```bash
curl -X PATCH "$DIRECTUS_URL/fields/section_symptoms_translations/symptoms" \
  -H "Authorization: Bearer $DIRECTUS_TOKEN" -H "Content-Type: application/json" \
  -d '{"meta": {"options": {"template": "{{text}} ({{species}})"}}}'
```

`options.template` persisted correctly via `mcp__directus__update-field` in testing (unlike `special`, §1 — this key isn't affected by that bug). Set this on every new `list-o2m` field as part of creating it, not as an afterthought — it's easy to forget since the field works fine without it, just displays poorly.

## 4. Content-model conventions already established in this project

See `CLAUDE.md` → "Directus — модель контента" for the O2M child-collection pattern (`sort` + `ref_id` FK, `on_delete: SET NULL`) used for repeatable items (`section_hero_block`, `section_services_item`, etc.) — group fields (this skill) are for **visually organizing scalar fields on one record**, a completely different concern from that O2M pattern for **repeatable child items**. Don't conflate the two.
