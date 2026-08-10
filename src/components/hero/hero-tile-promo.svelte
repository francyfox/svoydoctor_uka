<script lang="ts">
	import HeroTile from './hero-tile.svelte';
	import * as m from '$lib/paraglide/messages.js';
	import { cn } from '$lib/utils.js';
	import type { HeroBackgroundMedia } from '$lib/types/content';

	let {
		title,
		link,
		backgroundId,
		class: className
	}: {
		title: string;
		link?: string;
		backgroundId?: string;
		class?: string;
	} = $props();

	const background = $derived<HeroBackgroundMedia | undefined>(
		backgroundId ? { id: backgroundId, kind: 'image' } : undefined
	);
</script>

<HeroTile
	href={link}
	{background}
	backgroundWidth={280}
	backgroundHeight={348}
	overlay={!!background}
	class={cn('flex flex-col justify-end bg-accent p-4', className)}
>
	<span class="relative text-sm font-medium tracking-wide text-[#FBE6F4] uppercase">
		{m.hero_promo_label()}
	</span>
	<h2
		class="relative font-heading mt-1 text-2xl leading-tight text-white lg:text-[length:var(--font-tile-h3)]"
	>
		{title}
	</h2>
</HeroTile>
