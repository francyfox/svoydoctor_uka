import { json } from '@sveltejs/kit';
import { getSectionHero } from '$lib/server/directus';
import { getLocale } from '$lib/paraglide/runtime';
import type { RequestHandler } from './$types';

export const prerender = true;

export const GET: RequestHandler = async () => {
	return json(await getSectionHero(getLocale()));
};
