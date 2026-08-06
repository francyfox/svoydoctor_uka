<script lang="ts">
	import { buildAssetUrl } from '$lib/directus/assets.js';
	import { cn } from '$lib/utils.js';
	import ImageOff from '@lucide/svelte/icons/image-off';

	let {
		id,
		alt,
		size = 24,
		class: className
	}: {
		id: string | null | undefined;
		alt: string;
		size?: number;
		class?: string;
	} = $props();

	let loaded = $state(false);
	let errored = $state(false);

	// SSR-rendered <img> tags start loading as soon as the browser parses the HTML,
	// which can finish before hydration attaches onload — so also check .complete on mount.
	function checkAlreadyLoaded(img: HTMLImageElement) {
		if (img.complete && img.naturalWidth > 0) loaded = true;
	}
</script>

{#if id}
	<div class={cn('relative inline-block shrink-0', className)} style="width: {size}px; height: {size}px;">
		{#if !loaded && !errored}
			<div class="absolute inset-0 animate-pulse rounded-full bg-[color:var(--color-photo-placeholder)]"></div>
		{/if}

		{#if errored}
			<ImageOff class="text-muted-foreground absolute inset-0 size-full" />
		{:else}
			<img
				src={buildAssetUrl(id, { width: size * 2 })}
				{alt}
				width={size}
				height={size}
				loading="lazy"
				decoding="async"
				class={cn('size-full object-contain transition-opacity', loaded ? 'opacity-100' : 'opacity-0')}
				onload={() => (loaded = true)}
				onerror={() => (errored = true)}
				{@attach checkAlreadyLoaded}
			/>
		{/if}
	</div>
{/if}
