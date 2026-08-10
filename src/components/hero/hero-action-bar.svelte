<script lang="ts">
	import { resolve } from '$app/paths';
	import type { Pathname } from '$app/types';
	import * as m from '$lib/paraglide/messages.js';
	import { ApplyButton } from '$components/ui/apply-button/index.js';

	let {
		applyHref
	}: {
		applyHref?: string;
	} = $props();
</script>

<div
	class="mt-2 flex flex-col gap-4 bg-secondary px-4 py-5 sm:flex-row sm:items-center sm:justify-between lg:px-8"
>
	<nav class="flex flex-wrap gap-6 sm:gap-10">
		<a href="#symptoms" class="font-heading text-xl text-accent lg:text-2xl">
			{m.hero_link_symptoms()}
		</a>
		<a href="#contacts" class="font-heading text-xl text-accent lg:text-2xl">
			{m.hero_link_contacts()}
		</a>
	</nav>
	{#if applyHref}
		<ApplyButton
			href={resolve(applyHref as Pathname)}
			class="px-8 py-4 text-center text-lg sm:text-xl"
		>
			{m.cta_apply()}
		</ApplyButton>
	{/if}
</div>
