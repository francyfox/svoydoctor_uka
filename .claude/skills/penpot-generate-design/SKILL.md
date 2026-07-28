---
name: penpot-generate-design
description: "Project-specific addendum to the `penpot-mcp` skill — load BOTH whenever building or updating a page, screen, or section in this project's Penpot file (docker instance at localhost:9001, file `svoydoctor`). Triggers: 'сделай макет главной страницы в Penpot', 'собери /services из shadcn-компонентов', 'обнови блок Hero', typography/token work in the `UI_KIT` page. `penpot-mcp` covers the general Penpot MCP API/workflow rules; this skill covers what's specific to THIS project: the connected shadcn component library, the docs/ mapping, and this file's brand tokens."
disable-model-invocation: false
---

# Penpot work on this project — project-specific addendum

**Load `penpot-mcp` first** — it's the general-purpose skill for the Penpot MCP API (batching limits, `storage` usage, structural verification over `export_shape`, font-application gotchas including the stale-`fontId` issue, connection setup). This file only covers what `penpot-mcp` can't know: specifics of *this* project's file.

## 1. Ground every design decision in project docs, not improvisation

Before writing any `execute_code`:
- `docs/sitemap.md` — which page/section this is, what content blocks it needs, in what order
- `docs/ui-design-system.md` — tokens (colors, typography, spacing) and the shadcn-svelte component mapping (§5). Typography (headings `LXGW Marker Gothic`, body `PT Sans`, both chosen 2026-07-22, see §3) and brand-ink `#1F1B24` live here — don't hardcode competing values.
- `docs/ux-strategy.md` — behavioral intent behind a block when the mapping table alone doesn't explain the "why"

If a doc's decision looks stale or conflicts with the current task, update the doc — don't diverge from it silently in Penpot only (per project `CLAUDE.md`).

## 2. This file has a connected library with ~924 components — cache it, don't rescan

`penpot.library.connected` includes `@shadcn/ui - Design System (Community)`: ~924 components, mostly `icon/*` plus ~47 real UI components (`button`, `dialog`, `input`, `select`, `accordion`, `table`, …). `penpot-mcp`'s generic `storage` guidance applies — here's the concrete shape for this library:

```js
// Once per conversation
if (!storage.shadcnLibraryId) {
  const shadcn = penpot.library.connected.find(l => l.name.includes('shadcn'));
  storage.shadcnLibraryId = shadcn.id;
  storage.shadcnIndex = Object.fromEntries(shadcn.components.map(c => [c.name, c.id]));
}
```

```js
// Every later lookup — no rescan
const lib = penpot.library.connected.find(l => l.id === storage.shadcnLibraryId);
const comp = lib.components.find(c => c.id === storage.shadcnIndex['button']);
```

**Many of these components are variant groups** (`component.isVariant()` — confirmed true for `button`, axes `state` × `type`, 19 combinations). A name lookup alone gets the group, not a specific look — cache the variant map the first time you touch that component:

```js
if (!storage.componentVariants) storage.componentVariants = {};
function getVariant(name, matchProps) {
  const lib = penpot.library.connected.find(l => l.id === storage.shadcnLibraryId);
  if (!storage.componentVariants[name]) {
    const comp = lib.components.find(c => c.id === storage.shadcnIndex[name]);
    storage.componentVariants[name] = comp.isVariant()
      ? comp.variants.variantComponents().map(v => ({ id: v.id, props: v.variantProps }))
      : [{ id: comp.id, props: {} }];
  }
  const entry = storage.componentVariants[name].find(v =>
    Object.entries(matchProps).every(([k, val]) => v.props[k] === val)
  );
  if (!entry) throw new Error(`No variant of "${name}" matching ${JSON.stringify(matchProps)}`);
  return lib.components.find(c => c.id === entry.id);
}
storage.getVariant = getVariant;
```

Once cached, later calls just do `storage.getVariant('button', { state: 'Default', type: 'primary' }).instance()`.

**Don't trust component names from memory or from the doc table below without confirming against the live list** — community libraries drift between versions:

```js
const shadcn = penpot.library.connected.find(l => l.id === storage.shadcnLibraryId);
return shadcn.components.map(c => c.name).filter(n => !n.startsWith('icon/')).sort();
```

| Need (`docs/ui-design-system.md` §5) | shadcn library component name (verify live) |
|---|---|
| Кнопка звонка/WhatsApp | `button` (axes: `state` × `type`) |
| Модалка записи | `dialog`, `input`, `select`, `textarea` |
| Прайс лаборатории | `accordion` + `accordion Item`, `table` + `table item` |
| Подсказка/блок акции | no direct `alert`/`card` confirmed in this library as of 2026-07-22 — verify before assuming, fall back to a plain styled board only once confirmed missing |

## 3. Assemble screens per `docs/sitemap.md`, one section per call

Follow `penpot-mcp`'s batch-size and verification rules exactly (≤10 ops/call, structural checks over `export_shape`). At the project level: one content block from the sitemap (Hero, УТП, превью услуг, …) per `execute_code` call — instantiate library component(s) via `storage.getVariant`, parent into the section board, edit text content only where you've inspected the actual structure first (`penpotUtils.shapeStructure(instance, 2)`), `detach()` before any structural change to a still-linked instance.

Override instantiated components' colors/type to this project's tokens (`docs/ui-design-system.md` §2–3) rather than leaving the shadcn library's default theme — check `penpot.library.local.tokens` for existing bindings before hardcoding a hex value a second time.
