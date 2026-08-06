<script lang="ts">
	import { TileLink } from '$components/ui/tile-link/index.js';
	import { Image } from '$components/ui/image/index.js';
	import { Video } from '$components/ui/video/index.js';
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

<TileLink
	href={link}
	class={cn(
		'tile-frame relative overflow-hidden bg-[color:var(--color-photo-placeholder)]',
		className
	)}
>
	{#if background?.kind === 'video'}
		<Video id={background.id} />
	{:else}
		<Image id={background?.kind === 'image' ? background.id : undefined} alt="" width={280} height={348} priority />
	{/if}

	{#if hasText}
		<div class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent"></div>
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
</TileLink>
