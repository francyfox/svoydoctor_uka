<script lang="ts">
	import { TileLink } from '$components/ui/tile-link/index.js';
	import * as m from '$lib/paraglide/messages.js';
	import { cn } from '$lib/utils.js';

	let {
		title,
		link,
		class: className
	}: {
		title: string;
		link?: string;
		class?: string;
	} = $props();
</script>

<TileLink href={link} class={cn('tile-frame bg-accent flex flex-col justify-end p-4', className)}>
	<span class="text-sm font-medium tracking-wide text-[#FBE6F4] uppercase">
		{m.hero_promo_label()}
	</span>
	<h2 class="font-heading mt-1 text-2xl leading-tight text-white lg:text-[length:var(--font-tile-h3)]">
		{title}
	</h2>
</TileLink>
