# Свой Доктор

Сайт ветеринарного кабинета «Свой Доктор» (г. Усть-Каменогорск). Заменяет Instagram как единственный канал присутствия — запись на приём, актуальные цены и акции, зоозащитный раздел.

![SvelteKit](https://img.shields.io/badge/SvelteKit-FF3E00?style=flat-square&logo=svelte&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)
![shadcn-svelte](https://img.shields.io/badge/shadcn--svelte-000000?style=flat-square)
![ElysiaJS](https://img.shields.io/badge/ElysiaJS-6B46C1?style=flat-square)
![Squidex](https://img.shields.io/badge/Squidex-CMS-4A90D9?style=flat-square)
![PWA](https://img.shields.io/badge/PWA-5A0FC8?style=flat-square&logo=pwa&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=flat-square&logo=vercel&logoColor=white)
[![Penpot](https://img.shields.io/badge/Penpot-Design-6E4FE0?style=flat-square&logo=penpot&logoColor=white)](http://localhost:9001/#/view?file-id=f8c16428-9131-80df-8008-5c3e55c08a7b&page-id=f8c16428-9131-80df-8008-5c3e55c08a7c&section=interactions&index=0&share-id=5f9b543d-1449-8033-8008-63d35a2a44bf)

## Документация проекта

Весь бизнес-, UX- и дизайн-контекст — в [`docs/`](./docs):

- [`business-info.md`](./docs/business-info.md), [`services-and-pricing.md`](./docs/services-and-pricing.md), [`content-and-brand-voice.md`](./docs/content-and-brand-voice.md) — OSINT-разбор клиники по Instagram
- [`competitor-analysis.md`](./docs/competitor-analysis.md), [`analytics-and-reach.md`](./docs/analytics-and-reach.md) — конкуренты (ZOOVITA, Талисман) и охват
- [`ux-strategy.md`](./docs/ux-strategy.md) — цель, гипотеза, сценарии, IA, флоу, метрики
- [`sitemap.md`](./docs/sitemap.md) — карта сайта
- [`ui-design-system.md`](./docs/ui-design-system.md), [`visual-identity.md`](./docs/visual-identity.md), [`moodboard.md`](./docs/moodboard.md) — визуальные решения и референсы
- [Дизайн в Penpot](http://localhost:9001/#/view?file-id=f8c16428-9131-80df-8008-5c3e55c08a7b&page-id=f8c16428-9131-80df-8008-5c3e55c08a7c&section=interactions&index=0&share-id=5f9b543d-1449-8033-8008-63d35a2a44bf) — черновой вайрфрейм и макет

## Стек

SvelteKit + TypeScript, TailwindCSS + shadcn-svelte, SSR (Vercel adapter) — сайт редактируется сотрудниками клиники через Squidex (облако, бесплатный тариф) без участия разработчика. ElysiaJS как serverless-функции на Vercel рядом с сайтом. PWA для установки на телефон. Paraglide подключён для ru/kk (см. `project.inlang`).

## Разработка

```sh
bun install
bun run dev        # запуск дев-сервера
bun run dev -- --open
bun run build       # сборка
bun run preview     # предпросмотр сборки
```
