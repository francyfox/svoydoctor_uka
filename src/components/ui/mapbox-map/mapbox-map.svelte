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
				zoom
			});
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
