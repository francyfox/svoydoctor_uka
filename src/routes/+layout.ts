import { dehydrate } from '@tanstack/svelte-query';
import { getQueryClient } from '$lib/query-client';
import { settingsQueryKey } from '$lib/queries/settings';
import { socialLinksQueryOptions } from '$lib/queries/social-links';
import { getLocale } from '$lib/paraglide/runtime';
import type { LayoutLoad } from './$types';

export const prerender = true;

export const load: LayoutLoad = async ({ data, fetch }) => {
	const queryClient = getQueryClient();
	const locale = getLocale();

	queryClient.setQueryData(settingsQueryKey(locale), data.settings);
	await queryClient.prefetchQuery(socialLinksQueryOptions(fetch));

	return { queryClient, dehydratedState: dehydrate(queryClient) };
};
