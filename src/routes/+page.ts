import { dehydrate } from '@tanstack/svelte-query';
import { heroQueryOptions } from '$lib/queries/hero';
import { servicesQueryOptions } from '$lib/queries/services';
import { symptomsQueryOptions } from '$lib/queries/symptoms';
import { weHelpQueryOptions } from '$lib/queries/we-help';
import { pageSectionsQueryOptions } from '$lib/queries/page-sections';
import { pageMetaQueryOptions } from '$lib/queries/page-meta';
import { getLocale } from '$lib/paraglide/runtime';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch, parent }) => {
	const { queryClient } = await parent();
	const locale = getLocale();

	await Promise.all([
		queryClient.prefetchQuery(heroQueryOptions(locale, fetch)),
		queryClient.prefetchQuery(servicesQueryOptions(locale, fetch)),
		queryClient.prefetchQuery(symptomsQueryOptions(locale, fetch)),
		queryClient.prefetchQuery(weHelpQueryOptions(locale, fetch)),
		queryClient.prefetchQuery(pageSectionsQueryOptions(fetch)),
		queryClient.prefetchQuery(pageMetaQueryOptions('home', locale, fetch))
	]);

	return { dehydratedState: dehydrate(queryClient) };
};
