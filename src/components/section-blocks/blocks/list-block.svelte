<script lang="ts">
	import type { ListBlockData } from '$lib/types/content';
	import { TileLink } from '$components/ui/tile-link/index.js';

	let { data }: { data: ListBlockData } = $props();
</script>

<div class="tile-frame bg-secondary flex flex-col gap-2 p-4">
	{#if data.title}
		<h3 class="font-heading text-lg">{data.title}</h3>
	{/if}
	{#if data.items.length > 0}
		<ul class="flex flex-col gap-1">
			{#each data.items as item (item.id)}
				<li>
					<TileLink href={item.href} class="hover-zoom text-primary underline-offset-2 hover:underline">
						{item.label}
					</TileLink>
				</li>
			{/each}
		</ul>
	{/if}
</div>
