import { json } from '@sveltejs/kit';
import { getPageMeta } from '$lib/server/directus';
import { getLocale } from '$lib/paraglide/runtime';
import type { PageMetaKey } from '$lib/types/content';
import type { RequestHandler } from './$types';

export const prerender = true;

export const entries = () => {
	const keys: PageMetaKey[] = ['home', 'services', 'apply', 'about', 'we_help', 'contacts', 'privacy'];
	return keys.map((key) => ({ key }));
};

export const GET: RequestHandler = async ({ params }) => {
	return json(await getPageMeta(params.key as PageMetaKey, getLocale()));
};
