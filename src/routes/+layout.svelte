<script lang="ts">
	import { UFooter } from '$components/footer'
	import { QueryClientProvider, HydrationBoundary, createQuery } from '@tanstack/svelte-query';
	import { SvelteQueryDevtools } from '@tanstack/svelte-query-devtools'
	import { page } from '$app/state';
	import { browser } from '$app/environment';
	import { UHeader } from '$components/header/index.js';
	import { HotlineBanner } from '$components/hotline-banner/index.js';
	import { Maintenance } from '$components/maintenance/index.js';
	import { settingsQueryOptions } from '$lib/queries/settings';
	import { localeFromPathname } from '$lib/locale';
	import { initializeVisualEditor, cleanupVisualEditor, setAttr } from '$lib/visual-editor';
	import { buildAssetUrl } from '$lib/directus/assets';
	import './layout.css';

	let { data, children } = $props();

	const settingsQuery = createQuery(
		() => settingsQueryOptions(localeFromPathname(page.url.pathname)),
		() => data.queryClient
	);

	$effect(() => {
		initializeVisualEditor(data.queryClient);
		return () => cleanupVisualEditor();
	});

	$effect(() => {
		if (browser && 'serviceWorker' in navigator) {
			navigator.serviceWorker.register('/service-worker.js', {
				type: import.meta.env.DEV ? 'module' : 'classic'
			});
		}
	});
</script>

<svelte:head>
	{#if settingsQuery.data?.faviconId}
		<link rel="icon" href={buildAssetUrl(settingsQuery.data.faviconId)} type="image/svg+xml" />
	{/if}
	<link rel="apple-touch-icon" href="/icons/apple-touch-icon.png" />
	<link rel="manifest" href="/manifest.webmanifest" />
	<meta name="theme-color" content="#6e2c8c" />
</svelte:head>
<QueryClientProvider client={data.queryClient}>
	<HydrationBoundary
		state={data.dehydratedState}
		queryClient={data.queryClient}
		options={undefined}
	>
		{#if settingsQuery.data?.maintenanceModeEnabled}
			<Maintenance
				siteName={settingsQuery.data.siteName}
				phone={settingsQuery.data.phone}
				address={settingsQuery.data.address}
				logoId={settingsQuery.data.logoId}
				logoAlt={settingsQuery.data.logoAlt}
			/>
		{:else}
			<div class="flex min-h-dvh flex-col">
				{#if settingsQuery.data?.hotlineBannerEnabled && settingsQuery.data.hotlineBannerText}
					<HotlineBanner text={settingsQuery.data.hotlineBannerText} />
				{/if}
				{#if settingsQuery.data}
					<UHeader
						siteName={settingsQuery.data.siteName}
						phone={settingsQuery.data.phone}
						logoId={settingsQuery.data.logoId}
						logoAlt={settingsQuery.data.logoAlt}
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

				<div class="flex-1">
					{@render children()}
				</div>

				{#if settingsQuery.data}
					<UFooter
							siteName={settingsQuery.data.siteName}
							logoId={settingsQuery.data.logoId}
							logoAlt={settingsQuery.data.logoAlt}
					/>
				{/if}
			</div>
		{/if}
	</HydrationBoundary>

	<SvelteQueryDevtools />
</QueryClientProvider>
