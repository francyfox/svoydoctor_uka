import { apply, remove, setAttr } from '@directus/visual-editing';
import { invalidateAll } from '$app/navigation';
import { PUBLIC_DIRECTUS_URL } from '$env/static/public';

export { setAttr };

let applied = false;

/** Only does anything when actually rendered inside the Directus Visual Editor iframe. */
export async function initializeVisualEditor() {
	if (typeof window === 'undefined' || applied) return;

	await apply({
		directusUrl: PUBLIC_DIRECTUS_URL,
		onSaved: () => invalidateAll()
	});
	applied = true;
}

export function cleanupVisualEditor() {
	if (typeof window === 'undefined' || !applied) return;

	remove();
	applied = false;
}
