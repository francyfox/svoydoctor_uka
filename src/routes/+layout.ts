import { dehydrate } from '@tanstack/svelte-query';
import { getQueryClient } from '$lib/query-client';
import { settingsQueryOptions } from '$lib/queries/settings';
import type { LayoutLoad } from './$types';

export const load: LayoutLoad = async ({ fetch }) => {
	const queryClient = getQueryClient();

	await queryClient.prefetchQuery(settingsQueryOptions(fetch));

	return { queryClient, dehydratedState: dehydrate(queryClient) };
};
