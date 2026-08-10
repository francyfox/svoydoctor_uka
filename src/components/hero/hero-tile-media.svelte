<script lang="ts">
	import HeroTile from './hero-tile.svelte';
	import { cn } from '$lib/utils.js';
	import type { HeroBackgroundMedia } from '$lib/types/content';

	let {
		background,
		title,
		description,
		link,
		class: className
	}: {
		background?: HeroBackgroundMedia;
		title?: string;
		description?: string;
		link?: string;
		class?: string;
	} = $props();

	const hasText = $derived(!!(title || description));
</script>

<HeroTile
	href={link}
	{background}
	backgroundWidth={280}
	backgroundHeight={348}
	showPlaceholder
	overlay={hasText}
	class={cn('bg-[color:var(--color-photo-placeholder)]', className)}
>
	{#if hasText}
		<div class="relative flex h-full flex-col justify-end p-4">
			{#if title}
				<h3 class="font-heading text-xl leading-tight text-white lg:text-[length:var(--font-tile-h3)]">
					{title}
				</h3>
			{/if}
			{#if description}
				<p class="mt-1 text-sm text-white/90">{description}</p>
			{/if}
		</div>
	{/if}
</HeroTile>
