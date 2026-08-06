<script lang="ts">
	import type { HeroAdvantage } from '$lib/types/content';
	import { cn } from '$lib/utils.js';
	import { Icon } from '$components/ui/directus-icon/index.js';

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
	{#each advantages as advantage (advantage.id)}
		<div class="flex items-center gap-2">
			{#if advantage.iconId}
				<Icon id={advantage.iconId} alt="" size={20} />
			{/if}
			<p
				class="text-[length:var(--font-tile-small)] text-white"
				style="font-family: 'PT Sans', sans-serif"
			>
				{advantage.text}
			</p>
		</div>
	{/each}
</div>
