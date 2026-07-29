<script lang="ts">
	import { QueryClientProvider, HydrationBoundary, createQuery } from '@tanstack/svelte-query';
	import { Header } from '$components/header/index.js';
	import { settingsQueryOptions } from '$lib/queries/settings';
	import { isPreview } from '$lib/preview';
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';

	let { data, children } = $props();

	const settingsQuery = createQuery(
		() => settingsQueryOptions(),
		() => data.queryClient
	);

	const preview = $derived(isPreview());
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	{#if preview}
		<script src="https://cloud.squidex.io/scripts/embed-sdk.js"></script>
	{/if}
</svelte:head>
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
				editToken={preview ? settingsQuery.data.editToken : undefined}
			/>
		{/if}
		{@render children()}
	</HydrationBoundary>
</QueryClientProvider>
