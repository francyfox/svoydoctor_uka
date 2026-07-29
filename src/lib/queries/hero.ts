import { keepPreviousData } from '@tanstack/svelte-query';
import type { SectionHero } from '$lib/types/content';
import { localizeHref, type Locale } from '$lib/paraglide/runtime';

export function heroQueryKey(locale: string) {
	return ['hero', locale] as const;
}

export function heroQueryOptions(locale: string, fetchFn: typeof fetch = fetch) {
	return {
		queryKey: heroQueryKey(locale),
		queryFn: async (): Promise<SectionHero> => {
			const response = await fetchFn(localizeHref('/api/hero', { locale: locale as Locale }));
			return response.json();
		},
		// Keep showing the previous locale's data while the new one loads instead of
		// falling back to `undefined` (which the `{#if heroQuery.data}` guard would hide).
		placeholderData: keepPreviousData
	};
}
