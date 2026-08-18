import { dehydrate } from '@tanstack/svelte-query';
import { getQueryClient } from '$lib/query-client';
import { settingsQueryKey } from '$lib/queries/settings';
import { socialLinksQueryOptions } from '$lib/queries/social-links';
import { menuQueryOptions } from '$lib/queries/menu';
import { getLocale } from '$lib/paraglide/runtime';
import type { LayoutLoad } from './$types';

export const prerender = true;

export const load: LayoutLoad = async ({ data, fetch }) => {
	const queryClient = getQueryClient();
	const locale = getLocale();

	queryClient.setQueryData(settingsQueryKey(locale), data.settings);
	await Promise.all([
		queryClient.prefetchQuery(socialLinksQueryOptions(fetch)),
		queryClient.prefetchQuery(menuQueryOptions(locale, fetch))
	]);

	return { queryClient, dehydratedState: dehydrate(queryClient) };
};
