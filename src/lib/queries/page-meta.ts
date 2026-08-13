import { keepPreviousData } from '@tanstack/svelte-query';
import type { PageMeta, PageMetaKey } from '$lib/types/content';
import { localizeHref, type Locale } from '$lib/paraglide/runtime';

export function pageMetaQueryKey(key: PageMetaKey, locale: string) {
	return ['page-meta', key, locale] as const;
}

export function pageMetaQueryOptions(key: PageMetaKey, locale: string, fetchFn: typeof fetch = fetch) {
	return {
		queryKey: pageMetaQueryKey(key, locale),
		queryFn: async (): Promise<PageMeta> => {
			const response = await fetchFn(localizeHref(`/api/page-meta/${key}`, { locale: locale as Locale }));
			return response.json();
		},
		placeholderData: keepPreviousData
	};
}
