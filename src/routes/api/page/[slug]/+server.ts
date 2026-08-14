import { json } from '@sveltejs/kit';
import { getPage } from '$lib/server/directus';
import { getLocale } from '$lib/paraglide/runtime';
import type { RequestHandler } from './$types';

export const prerender = true;

export const GET: RequestHandler = async ({ params }) => {
	return json(await getPage(params.slug, getLocale()));
};
