import { PUBLIC_SITE_URL } from '$env/static/public';

export type AssetTransform = {
	width?: number;
	height?: number;
	format?: 'avif' | 'webp' | 'jpg';
	quality?: number;
	fit?: 'cover' | 'contain' | 'inside' | 'outside';
};

// Routed through our own /img proxy (src/routes/img/[id]/+server.ts) instead of straight
// to Directus — lets Vercel's edge cache assets and keep serving them if Directus is briefly
// down. Relative by default so it resolves against whatever origin actually served the page
// (localhost in dev, the real domain once deployed) — absolute only where a consumer outside
// the page itself needs a real URL (og:image meta tags, fetched directly by social crawlers).
export function buildAssetUrl(
	id: string,
	transform?: AssetTransform & { absolute?: boolean }
): string {
	const base = transform?.absolute ? PUBLIC_SITE_URL : '';
	const url = new URL(`${base}/img/${id}`, transform?.absolute ? undefined : 'http://placeholder');
	if (transform?.width) url.searchParams.set('width', String(Math.round(transform.width)));
	if (transform?.height) url.searchParams.set('height', String(Math.round(transform.height)));
	if (transform?.format) url.searchParams.set('format', transform.format);
	if (transform?.quality) url.searchParams.set('quality', String(transform.quality));
	if (transform?.fit) url.searchParams.set('fit', transform.fit);
	return transform?.absolute ? url.toString() : url.pathname + url.search;
}
