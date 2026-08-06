<script lang="ts">
	import { TileLink } from '$components/ui/tile-link/index.js';
	import { Image } from '$components/ui/image/index.js';
	import * as m from '$lib/paraglide/messages.js';
	import { cn } from '$lib/utils.js';

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
</script>

<TileLink
	href={link}
	class={cn('tile-frame relative flex flex-col justify-end overflow-hidden bg-accent p-4', className)}
>
	{#if backgroundId}
		<Image id={backgroundId} alt="" width={280} height={348} priority />
		<div class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
	{/if}
	<span class="relative text-sm font-medium tracking-wide text-[#FBE6F4] uppercase">
		{m.hero_promo_label()}
	</span>
	<h2
		class="relative font-heading mt-1 text-2xl leading-tight text-white lg:text-[length:var(--font-tile-h3)]"
	>
		{title}
	</h2>
</TileLink>
