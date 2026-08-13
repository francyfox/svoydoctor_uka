<script lang="ts">
	import type { HeroAdvantage } from '$lib/types/content';
	import { cn } from '$lib/utils.js';
	import Icon from '@iconify/svelte';
	import HeroTile from './hero-tile.svelte';

	let {
		advantages,
		class: className
	}: {
		advantages: HeroAdvantage[];
		class?: string;
	} = $props();
</script>

<HeroTile
	class={cn(
		'flex flex-col justify-center gap-3 bg-[color:var(--color-brand-primary-dark)] p-5',
		className
	)}
>
	{#each advantages as advantage (advantage.id)}
		<div class="relative flex items-center gap-2">
			{#if advantage.iconName}
				<Icon icon={advantage.iconName} width="20" height="20" class="text-white" />
			{/if}
			<p
				class="text-[length:var(--font-tile-small)] text-white"
				style="font-family: 'PT Sans', sans-serif"
			>
				{advantage.text}
			</p>
		</div>
	{/each}
</HeroTile>
