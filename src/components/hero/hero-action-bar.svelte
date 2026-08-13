<script lang="ts">
	import * as m from '$lib/paraglide/messages.js';
	import type { HeroLink } from '$lib/types/content';
	import { ApplyButton } from '$components/ui/apply-button/index.js';

	let { links }: { links: HeroLink[] } = $props();
</script>

<div
	class="mt-2 flex flex-col gap-4 bg-secondary px-4 py-5 sm:flex-row sm:items-center sm:justify-between lg:px-8"
>
	<nav class="flex flex-wrap gap-6 sm:gap-10">
		{#each links as link (link.id)}
			<a href={link.href} class="hover-zoom font-heading text-xl text-accent lg:text-2xl">
				{link.label}
			</a>
		{/each}
	</nav>
	<ApplyButton href="#apply" class="px-8 py-4 text-center text-lg sm:text-xl">
		{m.cta_apply()}
	</ApplyButton>
</div>
