import { dehydrate } from '@tanstack/svelte-query';
import { pageQueryOptions } from '$lib/queries/page';
import { getLocale } from '$lib/paraglide/runtime';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch, parent }) => {
	const { queryClient } = await parent();
	const locale = getLocale();

	await queryClient.prefetchQuery(pageQueryOptions('home', locale, fetch));

	return { dehydratedState: dehydrate(queryClient) };
};
