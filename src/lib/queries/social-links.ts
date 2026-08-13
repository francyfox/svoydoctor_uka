import { keepPreviousData } from '@tanstack/svelte-query';
import type { SocialLink } from '$lib/types/content';
import { localizeHref } from '$lib/paraglide/runtime';

export function socialLinksQueryKey() {
	return ['social-links'] as const;
}

export function socialLinksQueryOptions(fetchFn: typeof fetch = fetch) {
	return {
		queryKey: socialLinksQueryKey(),
		queryFn: async (): Promise<SocialLink[]> => {
			const response = await fetchFn(localizeHref('/api/social-links'));
			return response.json();
		},
		placeholderData: keepPreviousData
	};
}
