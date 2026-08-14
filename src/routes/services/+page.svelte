<script lang="ts">
	import { createQuery } from '@tanstack/svelte-query';
	import { page } from '$app/state';
	import { Seo } from '$components/seo/index.js';
	import { Services } from '$components/services/index.js';
	import { SectionBlocks } from '$components/section-blocks/index.js';
	import { ServicesPromo } from '$components/services-promo/index.js';
	import { ServicesPriceList } from '$components/services-pricelist/index.js';
	import { pageQueryOptions } from '$lib/queries/page';
	import { settingsQueryOptions } from '$lib/queries/settings';
	import { localeFromPathname } from '$lib/locale';
	import { buildAssetUrl } from '$lib/directus/assets';
	import { setAttr } from '$lib/visual-editor';

	let { data } = $props();

	const locale = $derived(localeFromPathname(page.url.pathname));

	const pageQuery = createQuery(() => pageQueryOptions('services', locale), () => data.queryClient);
	const settingsQuery = createQuery(() => settingsQueryOptions(locale), () => data.queryClient);

	const sections = $derived(pageQuery.data?.sections ?? []);

	function editAttr(collection: string, item: number | undefined, fields: string[]) {
		return item ? setAttr({ collection, item, fields, mode: 'drawer' as const }) : undefined;
	}
</script>

{#if pageQuery.data && settingsQuery.data}
	<Seo
		title={pageQuery.data.title}
		description={pageQuery.data.description}
		siteName={settingsQuery.data.siteName}
		path="/services"
		noindex={pageQuery.data.noindex}
		ogImageUrl={pageQuery.data.ogImageId
			? buildAssetUrl(pageQuery.data.ogImageId, { width: 1200, height: 630, fit: 'cover' })
			: undefined}
	/>
{/if}

{#each sections as section (section.key)}
	{#if section.key === 'blocks'}
		<SectionBlocks
			title={section.data.title}
			description={section.data.description}
			items={section.data.items}
			heading="h1"
			shader={section.shader}
			directusAttr={editAttr('section_blocks_translations', section.data.translationId, [
				'title',
				'description',
				'items'
			])}
		/>
	{:else if section.key === 'services'}
		<Services
			title={section.data.title}
			items={section.data.items}
			shader={section.shader}
			directusAttr={editAttr('section_services_translations', section.data.translationId, ['items'])}
		/>
	{:else if section.key === 'services_promo'}
		<ServicesPromo promo={section.data} {locale} />
	{:else if section.key === 'services_pricelist'}
		<ServicesPriceList
			title={section.data.title}
			note={section.data.note}
			categories={section.data.categories}
			directusAttr={editAttr('section_services_pricelist_translations', section.data.translationId, [
				'categories'
			])}
		/>
	{/if}
{/each}
