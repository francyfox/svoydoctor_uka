import { json } from '@sveltejs/kit';
import { getSettings } from '$lib/server/directus';
import { getLocale } from '$lib/paraglide/runtime';
import type { RequestHandler } from './$types';

// Не пререндерится (в отличие от остальных /api/* роутов): режим техобслуживания и хотлайн-баннер
// должны отражаться на живом сайте без пересборки — см. CLAUDE.md, раздел про maintenance mode.
export const prerender = false;

export const GET: RequestHandler = async () => {
	return json(await getSettings(getLocale()));
};
