import type { RequestHandler } from './$types';
import { env } from '$lib/server/env';

// Not prerenderable: proxies an arbitrary Directus asset id, not a fixed known set.
export const prerender = false;

// s-maxage/Vercel-CDN-Cache-Control control Vercel's edge cache directly (independent of
// the shorter browser max-age); stale-if-error lets the edge keep serving a previously
// cached image for up to a week even if the fetch to Directus below starts failing —
// this is what survives a brief Directus/Render outage without images breaking site-wide.
const CACHE_HEADER =
	'public, max-age=3600, s-maxage=2592000, stale-while-revalidate=86400, stale-if-error=604800';

export const GET: RequestHandler = async ({ params, url, request }) => {
	const upstream = new URL(`${env.DIRECTUS_URL}/assets/${params.id}`);
	upstream.search = url.search;

	// Video playback depends on Range requests (seeking, and some browsers refuse to even
	// start playback without a proper 206 response) — forward the client's Range header
	// through to Directus and pass its 206/Content-Range/Accept-Ranges back unchanged.
	const range = request.headers.get('range');

	// Deliberately global fetch, not SvelteKit's event.fetch: this proxies an arbitrary
	// external (cross-origin) asset with no relation to the current request/page.
	let response: Response;
	try {
		response = await globalThis.fetch(upstream, range ? { headers: { range } } : undefined);
	} catch {
		return new Response('Directus unreachable', { status: 502 });
	}

	if (!response.ok || !response.body) {
		return new Response(response.body, { status: response.status });
	}

	const headers: Record<string, string> = {
		'content-type': response.headers.get('content-type') ?? 'application/octet-stream',
		'cache-control': CACHE_HEADER,
		'vercel-cdn-cache-control': CACHE_HEADER,
		'cdn-cache-control': CACHE_HEADER
	};
	const contentRange = response.headers.get('content-range');
	const acceptRanges = response.headers.get('accept-ranges');
	if (contentRange) headers['content-range'] = contentRange;
	if (acceptRanges) headers['accept-ranges'] = acceptRanges;

	// Directus/Cloudflare Brotli-compresses some responses (observed on SVGs — text
	// compresses well, unlike already-compressed JPEG/video which they leave alone).
	// undici's fetch() transparently decompresses response.body/arrayBuffer() for us, but
	// response.headers.get('content-length') still reports the ORIGINAL COMPRESSED wire
	// size, not the decompressed byte count we actually read. Forwarding that header
	// verbatim while streaming the (already-decompressed, larger) body straight through
	// made every client stop reading at the compressed length — a silent, deterministic
	// truncation, reproduced consistently (confirmed via a raw `content-encoding: br` +
	// mismatched content-length check). Whenever the upstream response was encoded, ignore
	// its content-length entirely and buffer instead — computing the real length ourselves
	// is the only way to declare an accurate value for what we're actually about to send.
	const contentEncoding = response.headers.get('content-encoding');
	const contentLength = response.headers.get('content-length');

	if (contentEncoding || !contentLength) {
		const buffer = await response.arrayBuffer();
		headers['content-length'] = String(buffer.byteLength);
		return new Response(buffer, { status: response.status, headers });
	}

	headers['content-length'] = contentLength;
	return new Response(response.body, { status: response.status, headers });
};
