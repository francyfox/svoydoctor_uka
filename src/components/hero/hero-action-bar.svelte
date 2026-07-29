<script lang="ts">
	import { resolve } from '$app/paths';
	import type { Pathname } from '$app/types';
	import * as m from '$lib/paraglide/messages.js';

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
		<a
			href={resolve(applyHref as Pathname)}
			class="font-heading bg-primary px-8 py-4 text-center text-lg text-white sm:text-xl"
		>
			{m.cta_apply()}
		</a>
	{/if}
</div>
