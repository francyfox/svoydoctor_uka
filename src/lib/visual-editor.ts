import { apply, remove, setAttr } from '@directus/visual-editing';
import type { QueryClient } from '@tanstack/svelte-query';
import { PUBLIC_DIRECTUS_URL } from '$env/static/public';

export { setAttr };

let applied = false;

/**
 * Only does anything when actually rendered inside the Directus Visual Editor iframe.
 * Data comes from TanStack Query (not SvelteKit `load`), so on save we invalidate
 * that cache directly instead of `invalidateAll()`, which has nothing to invalidate here.
 */
export async function initializeVisualEditor(queryClient: QueryClient) {
	if (typeof window === 'undefined' || applied) return;

	await apply({
		directusUrl: PUBLIC_DIRECTUS_URL,
		onSaved: () => queryClient.invalidateQueries()
	});
	applied = true;
}

export function cleanupVisualEditor() {
	if (typeof window === 'undefined' || !applied) return;

	remove();
	applied = false;
}
