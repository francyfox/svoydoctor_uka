<script lang="ts">
	import { createQuery } from '@tanstack/svelte-query';
	import { page } from '$app/state';
	import { Seo } from '$components/seo/index.js';
	import { DynamicForm } from '$components/dynamic-form/index.js';
	import { settingsQueryOptions } from '$lib/queries/settings';
	import { pageMetaQueryOptions } from '$lib/queries/page-meta';
	import { localeFromPathname } from '$lib/locale';
	import { buildAssetUrl } from '$lib/directus/assets';

	let { data } = $props();

	const settingsQuery = createQuery(
		() => settingsQueryOptions(localeFromPathname(page.url.pathname)),
		() => data.queryClient
	);
	const pageMetaQuery = createQuery(
		() => pageMetaQueryOptions('apply', localeFromPathname(page.url.pathname)),
		() => data.queryClient
	);
</script>

{#if pageMetaQuery.data && settingsQuery.data}
	<Seo
		title={pageMetaQuery.data.title}
		description={pageMetaQuery.data.description}
		siteName={settingsQuery.data.siteName}
		path="/apply"
		noindex={pageMetaQuery.data.noindex}
		ogImageUrl={pageMetaQuery.data.ogImageId
			? buildAssetUrl(pageMetaQuery.data.ogImageId, { width: 1200, height: 630, fit: 'cover' })
			: undefined}
	/>
{/if}

<section class="flex min-h-dvh flex-col items-center justify-center py-16">
	{#if settingsQuery.data}
		<DynamicForm
			collection="booking_requests"
			title="Записаться на приём"
			phone={settingsQuery.data.phone}
			queryClient={data.queryClient}
			class="w-full max-w-[480px]"
		/>
	{/if}
</section>
