import { keepPreviousData } from '@tanstack/svelte-query';
import type { MenuItem } from '$lib/types/content';
import { localizeHref, type Locale } from '$lib/paraglide/runtime';

export function menuQueryKey(locale: string) {
	return ['menu', locale] as const;
}

export function menuQueryOptions(locale: string, fetchFn: typeof fetch = fetch) {
	return {
		queryKey: menuQueryKey(locale),
		queryFn: async (): Promise<MenuItem[]> => {
			const response = await fetchFn(localizeHref('/api/menu', { locale: locale as Locale }));
			return response.json();
		},
		placeholderData: keepPreviousData
	};
}
