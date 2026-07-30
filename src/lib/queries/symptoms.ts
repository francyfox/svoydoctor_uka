import { keepPreviousData } from '@tanstack/svelte-query';
import type { SectionSymptoms } from '$lib/types/content';
import { localizeHref, type Locale } from '$lib/paraglide/runtime';

export function symptomsQueryKey(locale: string) {
	return ['symptoms', locale] as const;
}

export function symptomsQueryOptions(locale: string, fetchFn: typeof fetch = fetch) {
	return {
		queryKey: symptomsQueryKey(locale),
		queryFn: async (): Promise<SectionSymptoms> => {
			const response = await fetchFn(localizeHref('/api/symptoms', { locale: locale as Locale }));
			return response.json();
		},
		placeholderData: keepPreviousData
	};
}
