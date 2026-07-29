import type { Settings } from '$lib/types/content';

export const settingsQueryKey = ['settings'] as const;

export function settingsQueryOptions(fetchFn: typeof fetch = fetch) {
	return {
		queryKey: settingsQueryKey,
		queryFn: async (): Promise<Settings> => {
			const response = await fetchFn('/api/settings');
			return response.json();
		}
	};
}
