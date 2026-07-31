import { json } from '@sveltejs/kit';
import { getSettings } from '$lib/server/directus';
import { getLocale } from '$lib/paraglide/runtime';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async () => {
	return json(await getSettings(getLocale()));
};
