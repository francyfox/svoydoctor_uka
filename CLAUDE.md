## О проекте

Сайт ветеринарного кабинета «Свой Доктор» (Усть-Каменогорск) — замена Instagram как единственного канала. Перед любой работой над продуктовыми/UX/дизайн-решениями сверяйся с `docs/` — там уже собран и проверен весь контекст (OSINT по клинике, конкурентный анализ, UX-стратегия, карта сайта, дизайн-система, мудборд). Не изобретай заново то, что там уже решено; если решение из `docs/` устарело или противоречит текущей задаче — сначала обнови соответствующий файл, а не действуй в обход него.

Дизайн ведётся в Penpot: https://design.penpot.app/#/workspace?team-id=7ad540b5-8190-815d-8005-5e4a1e725ae0&file-id=bd31e32d-d69f-81e2-8008-6055cfeaab1c&page-id=b1f58a1c-6572-80c1-8008-5daa727ff8e1

## Project Configuration

- **Language**: TypeScript
- **Package Manager**: bun
- **Add-ons**: tailwindcss, sveltekit-adapter, paraglide, mcp
- **UI**: shadcn-svelte поверх Tailwind — см. `docs/ui-design-system.md` за токенами и мэппингом компонентов
- **Backend**: Squidex (облако, CMS для контента, который редактируют сотрудники клиники) + ElysiaJS (serverless на Vercel)
- **Deploy**: Vercel, SSR, PWA

---

You are able to use the Svelte MCP server, where you have access to comprehensive Svelte 5 and SvelteKit documentation. Here's how to use the available tools effectively:

## Available Svelte MCP Tools:

### 1. list-sections

Use this FIRST to discover all available documentation sections. Returns a structured list with titles, use_cases, and paths.
When asked about Svelte or SvelteKit topics, ALWAYS use this tool at the start of the chat to find relevant sections.

### 2. get-documentation

Retrieves full documentation content for specific sections. Accepts single or multiple sections.
After calling the list-sections tool, you MUST analyze the returned documentation sections (especially the use_cases field) and then use the get-documentation tool to fetch ALL documentation sections that are relevant for the user's task.

### 3. svelte-autofixer

Analyzes Svelte code and returns issues and suggestions.
You MUST use this tool whenever writing Svelte code before sending it to the user. Keep calling it until no issues or suggestions are returned.

### 4. playground-link

Generates a Svelte Playground link with the provided code.
After completing the code, ask the user if they want a playground link. Only call this tool after user confirmation and NEVER if code was written to files in their project.
