<script lang="ts">
	import { QueryClientProvider, HydrationBoundary, createQuery } from '@tanstack/svelte-query';
	import { SvelteQueryDevtools } from '@tanstack/svelte-query-devtools'
	import { page } from '$app/state';
	import { Header } from '$components/header/index.js';
	import { settingsQueryOptions } from '$lib/queries/settings';
	import { getLocaleForUrl } from '$lib/paraglide/runtime';
	import { initializeVisualEditor, cleanupVisualEditor, setAttr } from '$lib/visual-editor';
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';

	let { data, children } = $props();

	const settingsQuery = createQuery(
		() => settingsQueryOptions(getLocaleForUrl(page.url)),
		() => data.queryClient
	);

	$effect(() => {
		initializeVisualEditor(data.queryClient);
		return () => cleanupVisualEditor();
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
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
				logoId={settingsQuery.data.logoId}
				directusAttr={settingsQuery.data.directusId
					? setAttr({
							collection: 'settings',
							item: settingsQuery.data.directusId,
							fields: ['site_name', 'phone', 'logo'],
							mode: 'drawer'
						})
					: undefined}
			/>
		{/if}
		{@render children()}
	</HydrationBoundary>

	<SvelteQueryDevtools />
</QueryClientProvider>
