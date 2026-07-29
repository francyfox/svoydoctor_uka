<script lang="ts">
	import { TileLink } from '$components/ui/tile-link/index.js';
	import { cn } from '$lib/utils.js';

	let {
		imageUrl,
		placeholder,
		link,
		class: className,
		placeholderClass = 'text-lg'
	}: {
		imageUrl?: string;
		placeholder: string;
		link?: string;
		class?: string;
		placeholderClass?: string;
	} = $props();
</script>

<TileLink
	href={link}
	class={cn(
		'tile-frame relative overflow-hidden bg-[color:var(--color-photo-placeholder)]',
		className
	)}
>
	{#if imageUrl}
		<img src={imageUrl} alt="" class="size-full object-cover" />
	{:else}
		<span
			class={cn('absolute inset-0 flex items-end p-4 text-[#3A3A3D]', placeholderClass)}
			style="font-family: 'PT Sans', sans-serif"
		>
			{placeholder}
		</span>
	{/if}
</TileLink>
