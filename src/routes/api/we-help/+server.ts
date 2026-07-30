import { json } from '@sveltejs/kit';
import { getSectionWeHelp } from '$lib/server/squidex';
import { getLocale } from '$lib/paraglide/runtime';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async () => {
	return json(await getSectionWeHelp(getLocale()));
};
