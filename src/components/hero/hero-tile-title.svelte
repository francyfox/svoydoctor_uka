<script lang="ts">
	import HeroTile from './hero-tile.svelte';
	import { cn } from '$lib/utils.js';
	import type { HeroBackgroundMedia } from '$lib/types/content';

	let {
		title,
		description,
		link,
		background,
		class: className
	}: {
		title: string;
		description?: string;
		link?: string;
		background?: HeroBackgroundMedia;
		class?: string;
	} = $props();
</script>

<HeroTile
	href={link}
	{background}
	backgroundWidth={560}
	backgroundHeight={696}
	overlay={!!background}
	class={cn('flex flex-col justify-end bg-primary p-6 lg:p-10', className)}
>
	<h1
		class="relative font-heading text-5xl leading-[0.95] text-white lg:text-[length:var(--font-tile-display)]"
	>
		{title}
	</h1>
	{#if description}
		<p
			class="relative mt-3 text-xl leading-tight lg:mt-4 lg:text-[length:var(--font-tile-h3)]"
			style="color:#e8d9f0"
		>
			{description}
		</p>
	{/if}
</HeroTile>
