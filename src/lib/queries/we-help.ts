import { keepPreviousData } from '@tanstack/svelte-query';
import type { SectionWeHelp } from '$lib/types/content';
import { localizeHref, type Locale } from '$lib/paraglide/runtime';

export function weHelpQueryKey(locale: string) {
	return ['we-help', locale] as const;
}

export function weHelpQueryOptions(locale: string, fetchFn: typeof fetch = fetch) {
	return {
		queryKey: weHelpQueryKey(locale),
		queryFn: async (): Promise<SectionWeHelp> => {
			const response = await fetchFn(localizeHref('/api/we-help', { locale: locale as Locale }));
			return response.json();
		},
		placeholderData: keepPreviousData
	};
}
