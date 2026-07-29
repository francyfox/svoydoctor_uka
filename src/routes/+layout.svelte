<script lang="ts">
	import { QueryClientProvider, HydrationBoundary, createQuery } from '@tanstack/svelte-query';
	import { Header } from '$components/header/index.js';
	import { settingsQueryOptions } from '$lib/queries/settings';
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';

	let { data, children } = $props();

	const settingsQuery = createQuery(
		() => settingsQueryOptions(),
		() => data.queryClient
	);
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>
<QueryClientProvider client={data.queryClient}>
	<HydrationBoundary
		state={data.dehydratedState}
		queryClient={data.queryClient}
		options={undefined}
	>
		{#if settingsQuery.data}
			<Header
				siteName={settingsQuery.data.siteName}
				phone={settingsQuery.data.phone}
				logoUrl={settingsQuery.data.logoUrl}
			/>
		{/if}
		{@render children()}
	</HydrationBoundary>
</QueryClientProvider>
