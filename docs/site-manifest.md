# Site manifest — svoydoctor_uka

Per-project manifest required by `.claude/skills/site-blueprint/SKILL.md`. Migration to the 3-tier page-builder model (pages → sections → blocks) is **complete** as of 2026-08-14 — schema, content, frontend, all verified. Extended the same day: `pages` gained real identity/SEO fields (folding in the old `page_meta`), `page_services` was dissolved into 3 sections on a real `services` page, and a genuinely generic `section_blocks` type was added (the actual "pick a block type from a palette" constructor experience the admin UX was missing).

## Pages (`pages` + `pages_translations`)

2 rows: `home`, `services`. Each page: `key`, `status` (`draft`/`published`), `show_in_menu`, `noindex` (grouped into tabs "Основное"/"SEO" via `group-tabs`) + `pages_translations` (`title`, `description`, `og_image`, per locale). The standalone `/apply` route was removed entirely (2026-08-14, explicit user decision) — the booking form is only ever reached via the `#apply`/`#apply-sterilization` hash sheet, mounted globally in `+layout.svelte`; there is no `apply` page row and no dedicated `pages` entry for it.

`getPage(key, locale)` (`src/lib/server/directus.ts`) returns `{title, description, ogImageId, noindex, sections}` in one call — the page's own SEO fields and its section tree together, filtered to `status: 'published'`. No draft-preview flow yet (deliberately out of scope).

## Sections (`docs/global/sections/`)

| Type | Status | Slots | Notes |
|---|---|---|---|
| `section_hero` | `pending-promotion` | `tiles` (M2A, role-tagged: title/photo/promo/spare/media, restricted to `[block_media_card, block_list]`) · `advantages` (M2A, `[block_icon_label]`) · `links` (M2A, `[block_link]`) | Real content migrated. `role` replaces the old positional-array hack in `hero.svelte`. |
| `section_services` | `pending-promotion` | `items` (M2A, `[block_media_card]`, junction row carries `cta_label`) | Real content migrated. Reused verbatim on both pages — same instance attached to `home` and `services` via two `page_sections` rows, resolved through the normal section-dispatch path (no more standalone `getServicesSection()`/`/api/services` — removed 2026-08-14 as dead code once `/services` moved onto `getPage`). |
| `section_symptoms` | `pending-promotion` | `items` = plain O2M `section_symptom` (text+species) — deliberately not block-ified, single real shape, no type variance | Real content migrated (30 symptom rows total, both locales). |
| `section_we_help` | `pending-promotion` | `items` (M2A, `[block_media_card]`, junction row carries `featured`) | Real content migrated, including the Dosym shelter photo. |
| `section_contacts` | `pending-promotion` | none — thin marker (key/title/description only) | Real content is entirely `settings`-sourced (confirmed zero coupling in `contacts.svelte`); exists only so contacts participates in `page_sections` ordering/visibility uniformly. |
| `section_blocks` | `pending-promotion` | `items` (M2A, restricted to **all 4** block primitives: `[block_media_card, block_icon_label, block_link, block_list]`) | **New 2026-08-14.** The genuinely generic section — `title`/`description` both optional (a zero-item instance is a plain text block, covers the old `/services` intro copy). This is the section whose Directus Studio "Create New" picker actually shows a real multi-type palette — the concrete fix for the original UX complaint ("у нас есть строго несколько секции и все"). Verified against the live relation: `section_blocks_item.item`'s `one_allowed_collections` has all 4 types. |
| `section_services_promo` | `pending-promotion` | none — own fields (`enabled`/`price`/`original_price`/`valid_until`) + translated `title`/`description` | **New 2026-08-14.** Direct reframing of the old `page_services` promo_* fields as a real section. `enabled: false` today (no confirmed running promo) — frontend (`ServicesPromo.svelte`) shows a neutral fallback CTA instead of an empty gap when disabled. |
| `section_services_pricelist` | `pending-promotion` | `categories` = O2M `service_price_category` → O2M `service_price_item` (two-level child, re-parented from the old `page_services_translations`) | **New 2026-08-14.** Translated `title`/`note`; 39 real lab price rows × 2 locales, re-pointed via relation delete+recreate (see `.claude/skills/directus/SKILL.md` for why PATCH alone doesn't retarget a relation). |

## Blocks (`docs/global/blocks/primitives/`)

| Type | Used by |
|---|---|
| `block_media_card` (title/description/media/href) | hero tiles, services items (+ `cta_label` on the junction), we-help items (+ `featured` on the junction), `section_blocks` slot |
| `block_icon_label` (icon/label) | hero advantages, `section_blocks` slot |
| `block_link` (label/href) | hero action-bar links, `section_blocks` slot |
| `block_list` (title + O2M of `block_link`) | allowed on hero's `tiles` slot and on `section_blocks`' `items` slot — **no real content uses it yet** on either, reserved for future use |

All 4 primitives are now genuinely interchangeable inside `section_blocks` — first real proof the block layer is reusable across section types, not just registered-but-unused per slot.

## Core

`pages` → `page_sections` (M2A junction: `sort`/`page`/`collection`/`item`/`visible`/`shader`) → each section's own slots, one level deeper, same M2A pattern. `home`: 5 rows (hero/services/symptoms/we_help/contacts). `services`: 4 rows (blocks/services/services_promo/services_pricelist).

**Admin sidebar**: `forms` (`scripts/specs/nav-reorg.json`) and `blocks` (`scripts/specs/nav-reorg-blocks.json`) are both pure nav folders (no real table). `forms` groups `booking_requests`/`sterilization_requests`. `blocks` groups `page_sections` + all `section_*`/`block_*` collections, including the 3 new ones and their children (`section_blocks*`, `section_services_promo*`, `section_services_pricelist*`, `service_price_category`/`item` — all explicitly re-grouped into `blocks` on creation, since collection creation doesn't inherit sibling grouping automatically). Root: `pages`, `blocks`, `forms`, `languages`, `settings`, `social_links`. `page_meta` and `page_services` (and their `_translations` children) are **deleted**, not just hidden — folded into `pages`/new sections respectively, per the migration in this pass.

## Frontend

`src/lib/server/directus.ts`'s `getPage(pageKey, locale)` resolves the whole tree in one call. `src/routes/api/page/[slug]/+server.ts` → `src/lib/queries/page.ts` → `+page.ts`/`+page.svelte` on both `/` and `/services` (same section-dispatch pattern: `{#each sections as section}{#if section.key === '...'}`). New components: `src/components/section-blocks/` (`section-blocks.svelte` + `block-registry.ts` + `blocks/{media-card,icon-label,link,list}-block.svelte` — first real use of a registry-dispatch pattern for blocks, mirroring `dynamic-form/field-registry.ts`), `src/components/services-promo/`, `src/components/services-pricelist/` (extracted from the old bespoke `/services` markup, same content/behavior). `hero.svelte` still looks up tiles by `role` (unchanged this pass).

Removed as dead code once `/services` moved onto `getPage`: `getPageMeta`/`getPageServices`/`getServicesSection` (`directus.ts`), `src/lib/queries/page-meta.ts`/`page-services.ts`/`services.ts`, `src/routes/api/page-meta/`, `/api/page-services/`, `/api/services/`, and the entire `src/routes/apply/` route.

Verified: `bun run check` clean (only a pre-existing unrelated `paraglide/server.js` error), `svelte-autofixer` clean on every new/touched `.svelte` file, real browser render via `claude-in-chrome` for `/`, `/services`, `/kk/services`, `#apply` — zero console errors, price-list accordion expands with real data, booking form renders after a permissions fix (see below).

## Operational note: server `DIRECTUS_TOKEN` rotated mid-session (2026-08-14)

The runtime-facing `DIRECTUS_TOKEN` (used by `src/lib/server/env.ts`, i.e. every `/api/*` route in prod and dev) went invalid partway through this session — confirmed via direct `curl` (401). The user issued a new token; its role (`moderator` policy) initially had **zero** collection permissions (`read`/`create` explicitly granted per-collection in this Directus instance, not implied by `app_access`). Restored by granting `read` on every content collection (all `section_*`/`block_*`/`pages*`/`settings*`/`social_links`/`languages`) and `read`+`create` on `booking_requests`/`sterilization_requests` (the latter needed for `readFieldsByCollection` schema introspection used by `getFormSchema`, not just for the create-on-submit path) to the `moderate` policy, matching what the previous working token evidently had. If `/api/*` starts 403ing again after any future Directus policy cleanup, check `GET /permissions?filter[policy][_eq]=<moderate-policy-id>` first.

## What's NOT done (deliberately out of scope for this pass)

- Draft/preview flow for `status: draft` pages — no auth-gated preview link yet.
- `nav-menu.svelte` is still hardcoded links, not driven by `pages.show_in_menu`.
- `block_list` has zero real content anywhere it's allowed (hero tiles, `section_blocks`).
- No second real client yet, so nothing here has passed the promotion gate (Step 4, `site-blueprint` skill) — all types stay `pending-promotion`.

Full schema kept at `docs/directus-schema-snapshot.json` (refresh after any schema change: `curl "$DIRECTUS_URL/schema/snapshot" -H "Authorization: Bearer $DIRECTUS_ADMIN_TOKEN" | python3 -m json.tool > docs/directus-schema-snapshot.json`). Full pre-migration backup at `backups/20260814T091341Z/` (git-ignored).
