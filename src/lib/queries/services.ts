import { keepPreviousData } from '@tanstack/svelte-query';
import type { SectionServices } from '$lib/types/content';
import { localizeHref, type Locale } from '$lib/paraglide/runtime';

export function servicesQueryKey(locale: string) {
	return ['services', locale] as const;
}

export function servicesQueryOptions(locale: string, fetchFn: typeof fetch = fetch) {
	return {
		queryKey: servicesQueryKey(locale),
		queryFn: async (): Promise<SectionServices> => {
			const response = await fetchFn(localizeHref('/api/services', { locale: locale as Locale }));
			return response.json();
		},
		placeholderData: keepPreviousData
	};
}
