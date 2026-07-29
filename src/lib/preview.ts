import { page } from '$app/state';

/** `?preview` in the URL enables Squidex's click-to-edit overlay (embed-sdk.js) on published content. */
export function isPreview(): boolean {
	return page.url.searchParams.has('preview');
}
