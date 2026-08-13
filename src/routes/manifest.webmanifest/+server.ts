import { getSettings } from '$lib/server/directus';
import type { RequestHandler } from './$types';

export const prerender = true;

// Calls Directus directly instead of /api/settings — same reasoning as +layout.server.ts:
// this route is prerendered, /api/settings intentionally isn't (maintenance-mode freshness).
export const GET: RequestHandler = async () => {
	const settings = await getSettings('ru');

	const manifest = {
		name: `${settings.siteName} — ветеринарная клиника`,
		short_name: settings.siteName,
		start_url: '/',
		scope: '/',
		display: 'standalone',
		background_color: '#ffffff',
		theme_color: '#6e2c8c',
		lang: 'ru',
		icons: [
			{ src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
			{ src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' }
		]
	};

	return new Response(JSON.stringify(manifest), {
		headers: { 'content-type': 'application/manifest+json' }
	});
};
