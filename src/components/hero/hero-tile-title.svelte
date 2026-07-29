<script lang="ts">
	import { TileLink } from '$components/ui/tile-link/index.js';
	import { cn } from '$lib/utils.js';

	let {
		title,
		description,
		link,
		class: className
	}: {
		title: string;
		description?: string;
		link?: string;
		class?: string;
	} = $props();
</script>

<TileLink
	href={link}
	class={cn('tile-frame bg-primary flex flex-col justify-end p-6 lg:p-10', className)}
>
	<h1
		class="font-heading text-5xl leading-[0.95] text-white lg:text-[length:var(--font-tile-display)]"
	>
		{title}
	</h1>
	{#if description}
		<p
			class="mt-3 text-xl leading-tight lg:mt-4 lg:text-[length:var(--font-tile-h3)]"
			style="color:#e8d9f0"
		>
			{description}
		</p>
	{/if}
</TileLink>
