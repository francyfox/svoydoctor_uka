<script lang="ts">
	import { Image as UnpicImage, Source } from '@unpic/svelte';
	import { cn } from '$lib/utils.js';
	import ImageOff from '@lucide/svelte/icons/image-off';
	import ImageIcon from '@lucide/svelte/icons/image';

	let {
		id,
		alt,
		width,
		height,
		fit = 'cover',
		priority = false,
		svg = false,
		class: className
	}: {
		id: string | null | undefined;
		alt: string;
		width: number;
		height: number;
		fit?: 'cover' | 'contain';
		priority?: boolean;
		/** Directus doesn't rasterize SVG files — it always returns them as-is regardless of
		 * a requested format=avif/webp, which breaks the <picture><source type="image/avif">
		 * negotiation below (declared type doesn't match the actual SVG bytes, so the browser
		 * fails to decode it). Skip the format-negotiation dance entirely for SVG sources. */
		svg?: boolean;
		class?: string;
	} = $props();

	let loaded = $state(false);
	let errored = $state(false);

	// @unpic/svelte doesn't forward onload/onerror props to the underlying <img> it
	// renders, and an SSR-rendered <img> can already be finished loading before
	// hydration runs — so reach into the DOM directly and wire up listeners there.
	function watchLoadState(container: Element) {
		const img = container.querySelector('img');
		if (!img) return;

		if (img.complete && img.naturalWidth > 0) {
			loaded = true;
			return;
		}

		const onload = () => (loaded = true);
		const onerror = () => (errored = true);
		img.addEventListener('load', onload);
		img.addEventListener('error', onerror);
		return () => {
			img.removeEventListener('load', onload);
			img.removeEventListener('error', onerror);
		};
	}
</script>

{#if id && svg}
	<!--
		SVGs skip the whole loaded/errored state machine below: Directus never rasterizes
		SVG files (always returns them as-is regardless of a requested format=avif/webp,
		which would otherwise break the <picture><source type="image/avif"> negotiation —
		declared type wouldn't match the actual SVG bytes). They also commonly report
		naturalWidth/naturalHeight as 0 even once fully loaded (an SVG with no explicit
		width/height/viewBox has no "natural size" by spec), which made watchLoadState's
		`naturalWidth > 0` completion check below hang forever in the loading-skeleton
		state for a perfectly fine logo. Small brand-asset SVGs don't need the fade-in
		treatment anyway — just render the <img> directly.
	-->
	<img
		src="/img/{id}"
		{alt}
		{width}
		{height}
		loading={priority ? 'eager' : 'lazy'}
		decoding="async"
		class={cn('absolute inset-0 flex !w-full object-cover object-center', className)}
	/>
{:else if id}
	<div class={cn('absolute inset-0', className)} {@attach watchLoadState}>
		{#if !loaded && !errored}
			<div class="absolute inset-0 animate-pulse bg-[color:var(--color-photo-placeholder)]"></div>
		{/if}

		{#if errored}
			<div class="bg-muted absolute inset-0 flex items-center justify-center">
				<ImageOff class="text-muted-foreground size-6" />
			</div>
		{:else}
			<!--
				@unpic/svelte's Image captures its `class` prop once at mount (a plain
				`const {...rest} = props` destructure, not reactive), so a class that
				depends on `loaded` never updates on the actual <img>. Own the fade
				transition on this wrapper div instead.
			-->
			<!--
				@unpic/core's Image builds srcset with an unset top-level `format`, which
				clobbers `operations.format` (object spread order bug) — format never
				reaches the request. Source doesn't have this bug (format comes from
				`type`), so do explicit format negotiation via <picture><source> instead.
			-->
			<div class={cn('w-full size-full transition-opacity', loaded ? 'opacity-100' : 'opacity-0')}>
				<picture class="w-full h-full flex">
					<Source
						src="/img/{id}"
						cdn="directus"
						type="image/avif"
						operations={{ directus: { fit } }}
						layout="fixed"
						{width}
						{height}
					/>
					<Source
						src="/img/{id}"
						cdn="directus"
						type="image/webp"
						operations={{ directus: { fit } }}
						layout="fixed"
						{width}
						{height}
					/>
					<UnpicImage
						src="/img/{id}"
						cdn="directus"
						operations={{ directus: { fit } }}
						layout="fixed"
						{width}
						{height}
						{alt}
						{priority}
						loading={priority ? 'eager' : 'lazy'}
						decoding="async"
						class="flex !w-full object-cover object-center"
					/>
				</picture>
			</div>
		{/if}
	</div>
{:else}
	<div
		class={cn(
			'absolute inset-0 flex items-center justify-center bg-[color:var(--color-photo-placeholder)]',
			className
		)}
	>
		<ImageIcon class="size-6 text-black/20" />
	</div>
{/if}
