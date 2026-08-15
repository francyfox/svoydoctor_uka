/// <reference types="@sveltejs/kit" />
/// <reference lib="webworker" />
import { build, files, version } from '$service-worker';

declare let self: ServiceWorkerGlobalScope;

const CACHE_NAME = `cache-${version}`;
const ASSETS = [...build, ...files];

self.addEventListener('install', (event) => {
	event.waitUntil(
		caches
			.open(CACHE_NAME)
			.then((cache) => cache.addAll(ASSETS))
			.then(() => self.skipWaiting())
	);
});

self.addEventListener('activate', (event) => {
	event.waitUntil(
		caches
			.keys()
			.then((keys) => Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))))
			.then(() => self.clients.claim())
	);
});

// Cache-first for the app shell/static assets, network-first (falling back to cache) for
// everything else — but /api/* is always network-only: it carries live operational data
// (maintenance mode, hotline banner, page SEO) that must never be served stale from cache.
//
// In dev, skip interception entirely. Vite's own module URLs (/src/*, /node_modules/.vite/deps/*,
// /@vite/client, ...) aren't in the precached ASSETS list, so they'd fall into the network-first
// branch below and get cached — but those URLs are volatile in dev (their content changes across
// every dev-server restart/re-optimization), so a stale cached response gets served back on the
// next load instead of the fresh module, breaking HMR/imports with confusing "unrecognized MIME
// type"/"error loading dynamically imported module" errors that look like a Vite bug but aren't.
self.addEventListener('fetch', (event) => {
	if (import.meta.env.DEV) return;

	const { request } = event;
	if (request.method !== 'GET') return;

	const url = new URL(request.url);
	if (url.origin !== self.location.origin || url.pathname.startsWith('/api/')) return;

	if (ASSETS.includes(url.pathname)) {
		event.respondWith(
			caches.match(request).then((cached) => cached ?? fetch(request))
		);
		return;
	}

	event.respondWith(
		(async () => {
			try {
				const response = await fetch(request);
				const cache = await caches.open(CACHE_NAME);
				cache.put(request, response.clone());
				return response;
			} catch (err) {
				const cached = await caches.match(request);
				if (cached) return cached;
				throw err;
			}
		})()
	);
});
