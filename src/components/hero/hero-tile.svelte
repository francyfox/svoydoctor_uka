<script lang="ts">
	import type { Snippet } from 'svelte';
	import { TileLink } from '$components/ui/tile-link/index.js';
	import { Image } from '$components/ui/image/index.js';
	import { Video } from '$components/ui/video/index.js';
	import { cn } from '$lib/utils.js';
	import type { HeroBackgroundMedia } from '$lib/types/content';

	let {
		href,
		background,
		backgroundWidth = 560,
		backgroundHeight = 696,
		showPlaceholder = false,
		overlay = false,
		class: className,
		children
	}: {
		href?: string;
		background?: HeroBackgroundMedia;
		backgroundWidth?: number;
		backgroundHeight?: number;
		showPlaceholder?: boolean;
		overlay?: boolean;
		class?: string;
		children: Snippet;
	} = $props();
</script>

<TileLink {href} class={cn('relative overflow-hidden', className)}>
	{#if background?.kind === 'video'}
		<Video id={background.id} />
	{:else if background || showPlaceholder}
		<Image
			id={background?.kind === 'image' ? background.id : undefined}
			alt=""
			width={backgroundWidth}
			height={backgroundHeight}
			priority
		/>
	{/if}
	{#if overlay}
		<div class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
	{/if}
	{@render children()}
</TileLink>
