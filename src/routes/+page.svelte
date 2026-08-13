<script lang="ts">
	import { createQuery } from '@tanstack/svelte-query';
	import { page } from '$app/state';
	import { Hero } from '$components/hero/index.js';
	import { Services } from '$components/services/index.js';
	import { Symptoms } from '$components/symptoms/index.js';
	import { WeHelp } from '$components/we-help/index.js';
	import { Contacts } from '$components/contacts/index.js';
	import { UFooter } from '$components/footer/index.js';
	import { Seo } from '$components/seo/index.js';
	import { heroQueryOptions } from '$lib/queries/hero';
	import { servicesQueryOptions } from '$lib/queries/services';
	import { symptomsQueryOptions } from '$lib/queries/symptoms';
	import { weHelpQueryOptions } from '$lib/queries/we-help';
	import { settingsQueryOptions } from '$lib/queries/settings';
	import { pageSectionsQueryOptions } from '$lib/queries/page-sections';
	import { pageMetaQueryOptions } from '$lib/queries/page-meta';
	import { localeFromPathname } from '$lib/locale';
	import { buildAssetUrl } from '$lib/directus/assets';
	import { setAttr } from '$lib/visual-editor';

	let { data } = $props();

	function editAttr(collection: string, item: number | undefined, fields: string[]) {
		return item ? setAttr({ collection, item, fields, mode: 'drawer' as const }) : undefined;
	}

	const heroQuery = createQuery(
		() => heroQueryOptions(localeFromPathname(page.url.pathname)),
		() => data.queryClient
	);
	const servicesQuery = createQuery(
		() => servicesQueryOptions(localeFromPathname(page.url.pathname)),
		() => data.queryClient
	);
	const symptomsQuery = createQuery(
		() => symptomsQueryOptions(localeFromPathname(page.url.pathname)),
		() => data.queryClient
	);
	const weHelpQuery = createQuery(
		() => weHelpQueryOptions(localeFromPathname(page.url.pathname)),
		() => data.queryClient
	);
	const settingsQuery = createQuery(
		() => settingsQueryOptions(localeFromPathname(page.url.pathname)),
		() => data.queryClient
	);
	const pageSectionsQuery = createQuery(
		() => pageSectionsQueryOptions(),
		() => data.queryClient
	);
	const pageMetaQuery = createQuery(
		() => pageMetaQueryOptions('home', localeFromPathname(page.url.pathname)),
		() => data.queryClient
	);

	const visibleSections = $derived((pageSectionsQuery.data ?? []).filter((section) => section.visible));
</script>

{#if pageMetaQuery.data && settingsQuery.data}
	<Seo
		title={pageMetaQuery.data.title}
		description={pageMetaQuery.data.description}
		siteName={settingsQuery.data.siteName}
		path="/"
		noindex={pageMetaQuery.data.noindex}
		ogImageUrl={pageMetaQuery.data.ogImageId
			? buildAssetUrl(pageMetaQuery.data.ogImageId, { width: 1200, height: 630, fit: 'cover' })
			: undefined}
	/>
{/if}

{#each visibleSections as section (section.key)}
	{#if section.key === 'hero'}
		{#if heroQuery.data && settingsQuery.data}
			<Hero
				blocks={heroQuery.data.blocks}
				advantages={heroQuery.data.advantages}
				links={heroQuery.data.links}
				phone={settingsQuery.data.phone}
				shader={section.shader}
				directusAttr={editAttr('section_hero_translations', heroQuery.data.translationId, [
					'blocks',
					'advantages',
					'links'
				])}
			/>
		{/if}
	{:else if section.key === 'services'}
		{#if servicesQuery.data}
			<Services
				title={servicesQuery.data.title}
				items={servicesQuery.data.items}
				shader={section.shader}
				directusAttr={editAttr('section_services_translations', servicesQuery.data.translationId, [
					'title',
					'items'
				])}
			/>
		{/if}
	{:else if section.key === 'symptoms'}
		{#if symptomsQuery.data}
			<Symptoms
				title={symptomsQuery.data.title}
				subtitle={symptomsQuery.data.subtitle}
				symptoms={symptomsQuery.data.symptoms}
				slider={symptomsQuery.data.slider}
				shader={section.shader}
				directusAttr={editAttr('section_symptoms_translations', symptomsQuery.data.translationId, [
					'title',
					'subtitle',
					'symptoms'
				])}
			/>
		{/if}
	{:else if section.key === 'we_help'}
		{#if weHelpQuery.data}
			<WeHelp
				title={weHelpQuery.data.title}
				items={weHelpQuery.data.items}
				slider={weHelpQuery.data.slider}
				shader={section.shader}
				directusAttr={editAttr('section_we_help_translations', weHelpQuery.data.translationId, [
					'title',
					'items'
				])}
			/>
		{/if}
	{:else if section.key === 'contacts'}
		{#if settingsQuery.data}
			<Contacts
				address={settingsQuery.data.address}
				hoursWeekday={settingsQuery.data.hoursWeekday}
				hoursSaturday={settingsQuery.data.hoursSaturday}
				offDays={settingsQuery.data.offDays}
				ratingValue={settingsQuery.data.ratingValue}
				ratingLabel={settingsQuery.data.ratingLabel}
				reviewsUrl={settingsQuery.data.reviewsUrl}
				mapbox={settingsQuery.data.mapbox}
				clinicPhotoId={settingsQuery.data.clinicPhotoId}
				clinicPhotoAlt={settingsQuery.data.clinicPhotoAlt}
				shader={section.shader}
				directusAttr={editAttr('settings_translations', settingsQuery.data.translationId, [
					'address',
					'hours_weekday',
					'hours_saturday',
					'rating_label'
				])}
			/>
		{/if}
	{/if}
{/each}
