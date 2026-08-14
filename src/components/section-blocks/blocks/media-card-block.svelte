<script lang="ts">
	import type { MediaCardBlockData } from '$lib/types/content';
	import { TileLink } from '$components/ui/tile-link/index.js';
	import { Image } from '$components/ui/image/index.js';
	import { UVideo } from '$components/ui/video/index.js';

	let { data }: { data: MediaCardBlockData } = $props();
</script>

<TileLink href={data.href} class="tile-frame hover-zoom relative flex h-64 flex-col overflow-hidden">
	{#if data.background?.kind === 'video'}
		<UVideo id={data.background.id} />
	{:else}
		<Image id={data.background?.id} alt={data.background?.alt ?? ''} width={400} height={256} />
	{/if}
	{#if data.title || data.description}
		<div class="relative mt-auto flex flex-col gap-1 bg-gradient-to-t from-black/70 via-black/20 to-transparent p-4">
			{#if data.title}
				<h3 class="font-heading text-lg text-white">{data.title}</h3>
			{/if}
			{#if data.description}
				<p class="text-sm text-white/90">{data.description}</p>
			{/if}
		</div>
	{/if}
</TileLink>
