---
name: site-blueprint
description: "Load BEFORE any structural change to page/content architecture on this template stack — bootstrapping a new client site, adding a new page, adding a new block/section type, adding a menu item type, or editing a core collection (settings/pages/page_sections). Triggers: 'создай новый сайт для клиента', 'добавь секцию/блок X', 'нужен новый тип блока', 'добавь пункт меню', 'нужно мега-меню', 'добавь поле в settings', any request that would add a new Directus collection or field to the page-structure model. Walks a fixed reuse-check → classify → build → promotion-gate sequence, defined in docs/global/architecture.md and docs/global/why-not-one-schema.md, to stop the schema/legacy sprawl that JSON-schema-driven CMS builders (MegaGroup/Bitrix-style universal templates) suffer from."
disable-model-invocation: false
---

# Site Blueprint — consistent-structure gate

## Why this skill exists

`docs/global/architecture.md` describes the architecture (core `settings`/`pages`/`page_sections` + an open library of `section_*` and `block_*`/`nav_*` types — sections and blocks are two distinct levels, not synonyms: a section composes a page, a block is the atomic content primitive inside a section's slot). Architecture alone doesn't prevent bloat — MegaGroup/Bitrix-style builders also started from "one universal schema" and drowned not in design but in *process*: every next client added "just one more optional field" with no review, until core grew conditional logic (`showIf`) and the type library filled up with near-duplicate entities. This skill is not architecture — it's the **process** that keeps the architecture honest: a fixed sequence of steps before anything new lands in the schema.

If this is the first use of this skill in a project and `docs/global/README.md` doesn't exist yet — read/create it first (the architecture precondition); this skill doesn't replace it.

## When to run

- Bootstrapping a new client site on this stack.
- A request to add a page, section, block, menu item, or `settings` field.
- Any edit to a core collection (`settings`, `pages`, `page_sections`) — these are the most expensive to get wrong, since they're shared across every site.
- Do NOT run for content-only edits (text, images, values of existing fields) — only for **structural** changes (new collection/field/relation).

## Scenario — mandatory order, don't skip or reorder steps

### Step 0 — bootstrap a new site (only when the client is new, not an existing project)

1. Apply the **core** `schema snapshot` (settings + the base block triple `key`/`title`/`description` + `pages`/`page_sections`/M2A) to a clean Directus instance — never hand-assemble core again, even if it "seems faster."
2. Create an empty type manifest for this client (`docs/site-manifest.md` in its repo) — the list of `block_*`/`nav_*` types actually wired up for it. Starts empty, grows only through Step 3.

### Step 1 — reuse check (mandatory before ANY new type)

Before creating a `block_*`/`nav_*` collection:

1. Check `docs/global/blocks/primitives/` first — is this shape (or most of it) already an atomic primitive (`icon`, `link-text`, `media`, ...)? Composition over inheritance: a new type should be primitives + a documented extension, not an independently-invented monolith. Two types built the same day (`block_services_item`, `block_we_help_item`) turned out to be the same `media-card` shape duplicated instead of extended — see `docs/global/why-not-one-schema.md` § "монолитные типы вместо композиции".
2. Check it against the catalog of existing composite types (`docs/global/blocks/*.json` and `docs/global/block-catalog.md` once it exists — see "Artifacts" below; until then, the library is whatever's already shipped on at least one site, including `svoydoctor_uka`).
3. Does an existing primitive/composite cover the request at 80%+? → use it, extend it with one field if needed, **no new type is created**. A small gap is a reason to parameterize, not fork under a new name.
4. No real new entity → Step 2.

Skipping this step is the most common source of near-duplicate types (`section_hero` and `section_hero_v2` with one new field, or two unrelated-named `block_*` types that are secretly the same shape — e.g. `block_services_item` and `block_we_help_item` both duplicating `block_media_card` instead of extending it, caught and fixed on `svoydoctor_uka` 2026-08-14) — exactly the legacy sprawl this skill exists to prevent.

### Step 2 — classify: one-off vs. core-candidate

If unclear — ask the user explicitly (`AskUserQuestion`), don't guess:

- **One-off** — needed only by this one client (a promo block for a specific campaign, a client-specific widget). Created **only in that client's Directus instance**, never enters the shared `schema snapshot`/catalog, marked `local` in that client's manifest.
- **Core-candidate** — sounds like other clients will need it too (another services-section variant, another menu style). Goes through Step 3, but only enters shared core after Step 4 (promotion gate) — not before.

### Step 3 — build the new type

Follow the base contract from `docs/global/architecture.md`:

- `key` (unique editor-facing slug) + `title`/`description` (per-locale, `description` optional) on `*_translations` — mandatory even if this particular type doesn't obviously need a `description` — the contract keeps every type uniform.
- Repeatable child items — O2M `sort`+`ref_id`, the same recipe used everywhere in the project (see `CLAUDE.md` / the `directus` skill).
- Fields — **only what's actually needed now**. No "just in case" optional fields, no `showIf`-style conditional logic inside one type — if a form genuinely branches, that's two types, not one with conditional fields (see "Anti-patterns").
- Register it in `block-registry`/`nav-registry` on the Svelte side immediately — a type with a schema but no component isn't done.
- Update the site's manifest (Step 0.2) — a new entry, `local` or `pending-promotion`.

### Step 4 — promotion gate (core-candidates only, before a type joins the shared snapshot)

All conditions are mandatory, not "case by case":

1. The type is used **identically** (not "roughly the same," literally the same schema) on 2+ real clients.
2. Re-checked against the catalog for >80% overlap with an existing type — if it overlaps, merge instead of adding a third near-duplicate.
3. Only after 1 and 2 — update the reference `schema snapshot` and `docs/global/block-catalog.md`.

Without a passed Step 4, a type stays `local`/`pending-promotion` even if you built it long ago and "obviously everyone will need it" — an assumption doesn't substitute for a second real usage.

## Anti-patterns — forbidden without an explicit, deliberate call from the user

- A "just in case" field on a core collection (`settings`/`pages`/`page_sections`) instead of a separate block type — core has to stay small; that's exactly what keeps it portable across clients.
- Conditional field visibility based on another field's value (`showIf`-style) inside one collection — a sure sign you need two types, not one. This specific practice is why JSON-schema builders (MegaGroup-style) turn into unreadable forms after 2-3 years.
- Copy-pasting an existing `block_*`/`nav_*` under a new name with 1-2 differences instead of parameterizing/extending the existing type (a skipped Step 1).
- Editing a specific client's prod schema without updating their manifest — silent drift from what the template/catalog actually knows about them.
- Promoting a type into the shared core snapshot on a single usage (a skipped Step 4).

## Artifacts this skill keeps in sync

- `docs/global/architecture.md` / `docs/global/why-not-one-schema.md` — the architecture. Touch only if the architecture itself changes, not for one client's sake.
- `docs/global/block-catalog.md` — registry of all **core** types (`block_*`/`nav_*` that passed the promotion gate): short description, top-level field shape, list of clients using it. Create it on the first type that passes the gate — don't scaffold it empty ahead of time.
- `docs/site-manifest.md` (per-project, in each specific client's own repo, not in `docs/global`) — which types are actually wired up for that client and their status (`local`/`pending-promotion`/`core`).
