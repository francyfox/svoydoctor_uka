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
		placeholderData: keepPreviousData,
		// Короче глобального дефолта (10 мин, query-client.ts): settings несёт срочные
		// операционные флаги (режим техобслуживания, баннер горячей линии), которые должны
		// подхватываться на живом сайте без долгого ожидания — /api/settings НЕ пререндерится
		// специально ради этого (см. +server.ts).
		staleTime: 60 * 1000
	};
}
