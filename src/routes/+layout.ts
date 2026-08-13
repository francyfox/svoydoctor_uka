import { dehydrate } from '@tanstack/svelte-query';
import { getQueryClient } from '$lib/query-client';
import { settingsQueryKey } from '$lib/queries/settings';
import { getLocale } from '$lib/paraglide/runtime';
import type { LayoutLoad } from './$types';

export const prerender = true;

export const load: LayoutLoad = async ({ data }) => {
	const queryClient = getQueryClient();
	const locale = getLocale();

	queryClient.setQueryData(settingsQueryKey(locale), data.settings);

	return { queryClient, dehydratedState: dehydrate(queryClient) };
};
