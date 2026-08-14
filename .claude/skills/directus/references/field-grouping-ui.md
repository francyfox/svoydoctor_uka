# Field-grouping UI (tabs / raw groups / accordions)

Load this reference only when the task is specifically about organizing scalar fields visually in the admin (tabs/accordions/grouping), not general schema work.

Directus has no literal "edit this subset of fields in a modal" for plain scalar fields (that pattern only exists for O2M/M2O relations, where a drawer opens the *related item*, not a subset of the current record's own fields). The available field-organizing primitives are all **group fields** — alias-type fields with no backing DB column that other fields point to via `meta.group`:

| Interface | Renders as | `options` |
|---|---|---|
| `group-raw` | No visual boundary — just a logical cluster in the field-tree order | — |
| `group-detail` | Collapsible accordion box | `{"start": "closed"}` to default-collapsed |
| `group-tabs` | Tab strip — each **direct child that is itself a group** becomes one tab; a direct child that's a plain field becomes a tab too (single-field tab) | — |

**You can nest a `group-raw` (or `group-detail`) inside a `group-tabs`** to put multiple fields in one tab — this is the actual working pattern confirmed in this project's `settings` collection (`settings_tabs` → `tab_general`/`tab_map`/`tab_notices`).

## The critical bug: wrong `special` makes the group vanish

A group field created with **`meta.special: ["group"]` alone is structurally valid and individually fetchable** (`GET /fields/:collection/:field` returns it fine) **but is silently excluded from both `GET /fields/:collection` and `GET /fields`** (collection-wide and global listings) — never renders in the Directus admin's "Data Model" screen at all, even after a hard refresh + `POST /utils/cache/clear`. Reproduced and fixed twice in this project.

**Fix — the `special` array must be exactly:**

```json
"special": ["alias", "no-data", "group"]
```

Not just `["group"]`. Verified by direct A/B test: `["group"]` → invisible in listings; `["alias", "no-data", "group"]` → appears immediately.

## Minimal working payload for a new group field

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

Because `create-field`/`update-field` (the MCP tools) drop `special`, creating group fields through them requires the same two-step dance as the main SKILL.md's known-bugs table (create, then verify) — or skip the dance entirely and use raw REST directly.

## Attaching child fields to a group

```bash
curl -X PATCH "$DIRECTUS_URL/fields/settings/some_field" \
  -H "Authorization: Bearer $DIRECTUS_TOKEN" -H "Content-Type: application/json" \
  -d '{"meta": {"group": "my_group"}}'
```

`meta.group` takes the **group field's `field` name as a string** (e.g. `"my_group"`), not its numeric `id`. To nest a group inside a tab, set the nested group's own `meta.group` to the tabs field's name — same mechanism, one level deeper.

## Naming convention for group/tab container fields

- **Top-level tabs container**: `<collection>_tabs` — one per collection, at most.
- **Each tab**: `tab_<purpose>`, short English snake_case — e.g. `tab_general`, `tab_map`. The user-visible label is set via `meta.translations: [{"language": "ru-RU", "translation": "Карта"}]` on the tab field, not the `field` name.
- **Standalone accordion group** (not nested in tabs): `group_<purpose>`.
- Never reuse a purpose-word that's also a real scalar field name on the same collection.

## Reliability caveat: tabs may hang on save

The Directus admin has been observed to **hang when saving** after using a `group-tabs` layout on this instance — not confirmed as a Directus-specific bug (this instance runs on Render.com free/low tier, which cold-starts and can stall on any request). If tabs prove flaky, prefer `group-detail` (accordion) or plain `group-raw` — simpler, not observed to hang.
