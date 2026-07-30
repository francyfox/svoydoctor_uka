import { dehydrate } from '@tanstack/svelte-query';
import { getQueryClient } from '$lib/query-client';
import { settingsQueryOptions } from '$lib/queries/settings';
import { getLocale } from '$lib/paraglide/runtime';
import type { LayoutLoad } from './$types';

export const load: LayoutLoad = async ({ fetch }) => {
	const queryClient = getQueryClient();
	const locale = getLocale();

	await queryClient.prefetchQuery(settingsQueryOptions(locale, fetch));

	return { queryClient, dehydratedState: dehydrate(queryClient) };
};
