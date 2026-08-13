import { getSettings } from '$lib/server/directus';
import { getLocale } from '$lib/paraglide/runtime';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async () => {
	return { settings: await getSettings(getLocale()) };
};
