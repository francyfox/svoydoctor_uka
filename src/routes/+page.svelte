<script lang="ts">
	import { createQuery } from '@tanstack/svelte-query';
	import { page } from '$app/state';
	import { Hero } from '$components/hero/index.js';
	import { heroQueryOptions } from '$lib/queries/hero';
	import { settingsQueryOptions } from '$lib/queries/settings';
	import { getLocaleForUrl } from '$lib/paraglide/runtime';

	let { data } = $props();

	const heroQuery = createQuery(
		() => heroQueryOptions(getLocaleForUrl(page.url)),
		() => data.queryClient
	);
	const settingsQuery = createQuery(
		() => settingsQueryOptions(),
		() => data.queryClient
	);
</script>

{#if heroQuery.data && settingsQuery.data}
	<Hero
		blocks={heroQuery.data.blocks}
		advantages={heroQuery.data.advantages}
		phone={settingsQuery.data.phone}
	/>
{/if}
