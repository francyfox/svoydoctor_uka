import { keepPreviousData } from '@tanstack/svelte-query';
import type { Settings } from '$lib/types/content';
import { localizeHref, type Locale } from '$lib/paraglide/runtime';

export function settingsQueryKey(locale: string) {
	return ['settings', locale] as const;
}

export function settingsQueryOptions(locale: string, fetchFn: typeof fetch = fetch) {
	return {
		queryKey: settingsQueryKey(locale),
		queryFn: async (): Promise<Settings> => {
			const response = await fetchFn(localizeHref('/api/settings', { locale: locale as Locale }));
			return response.json();
		},
		placeholderData: keepPreviousData
	};
}
