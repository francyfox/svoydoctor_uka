<script lang="ts">
	import type { HeroAdvantage } from '$lib/types/content';
	import { cn } from '$lib/utils.js';

	let {
		advantages,
		class: className
	}: {
		advantages: HeroAdvantage[];
		class?: string;
	} = $props();
</script>

<div
	class={cn(
		'tile-frame flex flex-col justify-center gap-3 bg-[color:var(--color-brand-primary-dark)] p-5',
		className
	)}
>
	{#each advantages as advantage (advantage.text)}
		<p
			class="text-[length:var(--font-tile-small)] text-white"
			style="font-family: 'PT Sans', sans-serif"
		>
			{advantage.text}
		</p>
	{/each}
</div>
