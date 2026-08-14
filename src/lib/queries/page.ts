import { keepPreviousData } from '@tanstack/svelte-query';
import type { Page } from '$lib/types/content';
import { localizeHref, type Locale } from '$lib/paraglide/runtime';

export function pageQueryKey(slug: string, locale: string) {
	return ['page', slug, locale] as const;
}

export function pageQueryOptions(slug: string, locale: string, fetchFn: typeof fetch = fetch) {
	return {
		queryKey: pageQueryKey(slug, locale),
		queryFn: async (): Promise<Page> => {
			const response = await fetchFn(localizeHref(`/api/page/${slug}`, { locale: locale as Locale }));
			return response.json();
		},
		placeholderData: keepPreviousData
	};
}
