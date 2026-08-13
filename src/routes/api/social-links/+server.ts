import { json } from '@sveltejs/kit';
import { getSocialLinks } from '$lib/server/directus';
import type { RequestHandler } from './$types';

export const prerender = true;

export const GET: RequestHandler = async () => {
	return json(await getSocialLinks());
};
