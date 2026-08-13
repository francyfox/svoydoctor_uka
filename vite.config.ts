import { paraglideVitePlugin } from '@inlang/paraglide-js';
import tailwindcss from '@tailwindcss/vite';
import adapter from '@sveltejs/adapter-vercel';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	server: {
		port: 3000,
		strictPort: true,
		host: '0.0.0.0',
	},
	plugins: [
		tailwindcss(),
		sveltekit({
			compilerOptions: {
				// Force runes mode for the project, except for libraries. Can be removed in svelte 6.
				runes: ({ filename }) => filename.split(/[/\\]/).includes('node_modules') ? undefined : true
			},
			adapter: adapter(),
			alias: {
				'$components': 'src/components',
				'$components/*': 'src/components/*'
			},
			prerender: {
				// /apply and /about are content-driven link targets that don't have routes yet;
				// don't fail the static build over them.
				handleHttpError: 'warn',
				// #apply / #apply-sterilization aren't scroll-to anchors — BookingSheet reads
				// them as client-side routing triggers (open the booking drawer), so no
				// element with that id is ever expected to exist on the page.
				handleMissingId: 'ignore'
			}
		}),

		paraglideVitePlugin({
			project: './project.inlang',
			outdir: './src/lib/paraglide',
			strategy: ['url', 'preferredLanguage', 'baseLocale']
		})
	]
});
