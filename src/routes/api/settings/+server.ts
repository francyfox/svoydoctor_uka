import { json } from '@sveltejs/kit';
import { getSettings } from '$lib/server/squidex';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async () => {
	return json(await getSettings());
};
