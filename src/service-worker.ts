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
self.addEventListener('fetch', (event) => {
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
