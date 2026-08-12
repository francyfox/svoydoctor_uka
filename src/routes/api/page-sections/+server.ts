import { json } from '@sveltejs/kit';
import { getPageSections } from '$lib/server/directus';
import type { RequestHandler } from './$types';

export const prerender = true;

export const GET: RequestHandler = async () => {
	return json(await getPageSections());
};
