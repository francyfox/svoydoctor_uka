# Шаблонирование стека под конвейер сайтов — индекс

Не читай всё подряд — открой файл под конкретную задачу. Каждый файл ниже самодостаточен; ссылки друг на друга — по необходимости, не обязательное чтение. Так и `site-blueprint`-скилл, и будущие агенты не забивают контекст одним разросшимся доком.

- [architecture.md](architecture.md) — core-модель: `settings`, базовая тройка блока (`key`/`title`/`description`), `page_sections`/section slots (M2A, two levels), block-registry. Открывать при: bootstrap нового сайта, вопрос «как устроена страница».
- [why-not-one-schema.md](why-not-one-schema.md) — почему core маленький, а не одна универсальная JSON-схема (проблема MegaGroup/Bitrix-style конструкторов). Открывать при: сомнении — заводить новое поле в core или новый тип блока.
- [patterns-social-menu.md](patterns-social-menu.md) — соцсети и меню: почему это не одна фиксированная форма. Открывать при: работе с меню/соцсетями.
- [schema-portability.md](schema-portability.md) — `schema snapshot`/`apply` между клиентами, открытые архитектурные вопросы (инстанс-на-клиента vs multi-tenant, общий npm-пакет vs форк). Открывать при: bootstrap нового клиента, вопрос «как перенести схему».
- [diagramming-setup.md](diagramming-setup.md) — как в Claude Code установлен `diagram-design` (плагин + global skill) для editorial-диаграмм. Открывать только если нужно перерисовать/добавить диаграмму.
- [multi-site-block-tree.html](multi-site-block-tree.html) — editorial-диаграмма дерева блочной модели (открывается в браузере).
- [blocks/primitives/](blocks/primitives/) — атомарные, content-agnostic примитивы (`icon.json`, `link-text.json`, `media.json` — как в shadcn, маленькие переиспользуемые кирпичи field-уровня, не привязанные к конкретной секции сайта). Композируются в конкретные `block_*`-типы прямо внутри `sections/*.json` (см. ниже) — расширяй существующий блок новым полем под конкретный кейс вместо форка новой почти-такой-же коллекции (см. `why-not-one-schema.md`).
- [sections/](sections/) — декларативные JSON-шаблоны на уровень секции (`hero.json`, `services.json`, `symptoms.json`, `we-help.json`, `contacts.json`): собирают `section_*`-коллекции + их M2A-слоты, ссылающиеся на `blocks/primitives/`. Применяются через `scripts/directus-schema-apply.py <spec>`. Открывать при: миграции секции на 3-уровневую page-builder модель.
- **Процесс** (обязательный сценарий перед структурными изменениями схемы) — не файл здесь, а скилл `.claude/skills/site-blueprint/SKILL.md` в каждом конкретном проекте — грузится автоматически по триггеру, самодостаточен.
- **Алгоритм схемной миграции** (raw-schema-first, снапшот, `scripts/directus-schema-apply.py`) — тоже не файл здесь, а `.claude/skills/directus/SKILL.md` §1 в каждом проекте.

Контекст: заведено 2026-08-14, пилот — `svoydoctor_uka` (миграция на эту модель полностью завершена на пилоте тем же днём — core, 4 примитива, 5 секций, реальный контент, фронтенд, проверено визуально). Статус конкретно `svoydoctor_uka` — не здесь (это не cross-project контент), см. `../site-manifest.md`.
