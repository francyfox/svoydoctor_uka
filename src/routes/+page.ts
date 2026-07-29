import { dehydrate } from '@tanstack/svelte-query';
import { heroQueryOptions } from '$lib/queries/hero';
import { getLocale } from '$lib/paraglide/runtime';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch, parent }) => {
	const { queryClient } = await parent();

	await queryClient.prefetchQuery(heroQueryOptions(getLocale(), fetch));

	return { dehydratedState: dehydrate(queryClient) };
};
