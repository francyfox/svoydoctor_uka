import { PUBLIC_DIRECTUS_URL } from '$env/static/public';

export type AssetTransform = {
	width?: number;
	height?: number;
	format?: 'avif' | 'webp' | 'jpg';
	quality?: number;
	fit?: 'cover' | 'contain' | 'inside' | 'outside';
};

export function buildAssetUrl(id: string, transform?: AssetTransform): string {
	const url = new URL(`${PUBLIC_DIRECTUS_URL}/assets/${id}`);
	if (transform?.width) url.searchParams.set('width', String(Math.round(transform.width)));
	if (transform?.height) url.searchParams.set('height', String(Math.round(transform.height)));
	if (transform?.format) url.searchParams.set('format', transform.format);
	if (transform?.quality) url.searchParams.set('quality', String(transform.quality));
	if (transform?.fit) url.searchParams.set('fit', transform.fit);
	return url.toString();
}
