import { keepPreviousData } from '@tanstack/svelte-query';
import type { PageSection } from '$lib/types/content';
import { localizeHref } from '$lib/paraglide/runtime';

export function pageSectionsQueryKey() {
	return ['page-sections'] as const;
}

export function pageSectionsQueryOptions(fetchFn: typeof fetch = fetch) {
	return {
		queryKey: pageSectionsQueryKey(),
		queryFn: async (): Promise<PageSection[]> => {
			const response = await fetchFn(localizeHref('/api/page-sections'));
			return response.json();
		},
		placeholderData: keepPreviousData
	};
}
