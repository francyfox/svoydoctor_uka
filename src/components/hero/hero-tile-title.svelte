<script lang="ts">
	import { TileLink } from '$components/ui/tile-link/index.js';
	import { Image } from '$components/ui/image/index.js';
	import { Video } from '$components/ui/video/index.js';
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

<TileLink
	href={link}
	class={cn(
		'tile-frame relative flex flex-col justify-end overflow-hidden bg-primary p-6 lg:p-10',
		className
	)}
>
	{#if background?.kind === 'video'}
		<Video id={background.id} />
		<div class="absolute inset-0 bg-gradient-to-t from-primary/100 via-black/20 to-transparent"></div>
	{:else if background}
		<Image id={background.id} alt="" width={560} height={696} priority />
		<div class="absolute inset-0 bg-gradient-to-t from-black/100 via-black/20 to-transparent"></div>
	{/if}
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
</TileLink>
