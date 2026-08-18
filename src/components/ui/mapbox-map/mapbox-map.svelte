<script lang="ts">
	import 'mapbox-gl/dist/mapbox-gl.css';
	import type { Map as MapboxMap } from 'mapbox-gl';
	import type { Attachment } from 'svelte/attachments';
	import { cn } from '$lib/utils.js';

	let {
		token,
		styleUrl,
		lng,
		lat,
		zoom,
		class: className
	}: {
		token: string;
		styleUrl: string;
		lng: number;
		lat: number;
		zoom: number;
		class?: string;
	} = $props();

	const mount: Attachment<HTMLDivElement> = (node) => {
		let map: MapboxMap | undefined;
		let cancelled = false;

		import('mapbox-gl').then(({ default: mapboxgl }) => {
			if (cancelled) return;
			mapboxgl.accessToken = token;
			map = new mapboxgl.Map({
				container: node,
				style: styleUrl,
				center: [lng, lat],
				zoom,
				// Marker sits at a fixed point — panning would drag it away from the
				// viewport center, and double-click zoom always zooms toward the click
				// point (no `around: 'center'` option on that handler, unlike scroll/pinch
				// below), so both are disabled to keep the marker centered at all times.
				// Zoom range itself is left unrestricted — scroll/pinch/± zoom freely.
				dragPan: false,
				doubleClickZoom: false
			});
			// `ScrollZoomHandler#enable` no-ops if scroll-zoom is already enabled (true by
			// default on an interactive map), silently ignoring the `around` option passed
			// here — has to be disabled first so the re-enable actually takes effect.
			map.scrollZoom.disable();
			map.scrollZoom.enable({ around: 'center' });
			map.touchZoomRotate.enable({ around: 'center' });
			map.addControl(new mapboxgl.NavigationControl(), 'top-right');
			new mapboxgl.Marker({ color: '#6e2c8c' }).setLngLat([lng, lat]).addTo(map);
		});

		return () => {
			cancelled = true;
			map?.remove();
		};
	};
</script>

<div data-slot="mapbox-map" class={cn('h-full w-full', className)} {@attach mount}></div>
