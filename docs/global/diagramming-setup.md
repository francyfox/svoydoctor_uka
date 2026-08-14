# Диаграммы — как это настроено

См. [README.md](README.md) для карты остальных файлов.

Для брендированных editorial-диаграмм (не просто mermaid-ASCII) в Claude Code установлен [`diagram-design`](https://github.com/cathrynlavery/diagram-design) (`cathrynlavery/diagram-design`) — генерирует самодостаточные HTML+SVG диаграммы (архитектура, tree, org chart, timeline и т.п.). Установка — двумя частями, обе глобальные (не per-project), сделано 2026-08-14:

1. `claude plugin marketplace add cathrynlavery/diagram-design` + `claude plugin install diagram-design@diagram-design` — сам плагин (marketplace-путь, обновления идут через `/plugin`).
2. Отдельно — **симлинк как global skill**, как описано в README репозитория (`ln -s .../plugins/marketplaces/diagram-design/skills/diagram-design ~/.claude/skills/diagram-design`), рядом с уже существующими `design-an-interface`/`frontend-design`/`web-design-guidelines`. Это оказалось нужно отдельно от шага 1: маркетплейс-плагин требует перезапуска сессии Claude Code, чтобы его скилл подхватился, а symlink в `~/.claude/skills/` подхватился сразу же, в той же сессии, без рестарта.

Дерево блочной модели ([architecture.md](architecture.md)) перерисовано этим скиллом в брендированном editorial-виде и сохранено рядом как [multi-site-block-tree.html](multi-site-block-tree.html) (самодостаточный HTML, открывается прямо в браузере) — это основной визуал; mermaid-версия в `architecture.md` — быстрый просмотр прямо в GitHub/markdown-вьюере.

При первом запуске скилл сам спросил, брать ли бренд-токены сайта или дефолтную палитру — для документов уровня `docs/global` (внутренние, не публичные, не привязаны к одному клиенту) выбрана дефолтная палитра скилла (jet-black + atomic-tangerine); при генерации диаграмм для публичных/презентационных материалов конкретного клиента имеет смысл переспросить и подтянуть его бренд-токены.
