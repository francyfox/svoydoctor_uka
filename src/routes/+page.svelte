<script lang="ts">
	import { createQuery } from '@tanstack/svelte-query';
	import { page } from '$app/state';
	import { Hero } from '$components/hero/index.js';
	import { Services } from '$components/services/index.js';
	import { Symptoms } from '$components/symptoms/index.js';
	import { WeHelp } from '$components/we-help/index.js';
	import { Contacts } from '$components/contacts/index.js';
	import { Seo } from '$components/seo/index.js';
	import { pageQueryOptions } from '$lib/queries/page';
	import { settingsQueryOptions } from '$lib/queries/settings';
	import { localeFromPathname } from '$lib/locale';
	import { buildAssetUrl } from '$lib/directus/assets';
	import { setAttr } from '$lib/visual-editor';

	let { data } = $props();

	function editAttr(collection: string, item: number | undefined, fields: string[]) {
		return item ? setAttr({ collection, item, fields, mode: 'drawer' as const }) : undefined;
	}

	const pageQuery = createQuery(
		() => pageQueryOptions('home', localeFromPathname(page.url.pathname)),
		() => data.queryClient
	);
	const settingsQuery = createQuery(
		() => settingsQueryOptions(localeFromPathname(page.url.pathname)),
		() => data.queryClient
	);

	const sections = $derived(pageQuery.data?.sections ?? []);
</script>

{#if pageQuery.data && settingsQuery.data}
	<Seo
		title={pageQuery.data.title}
		description={pageQuery.data.description}
		siteName={settingsQuery.data.siteName}
		path="/"
		noindex={pageQuery.data.noindex}
		ogImageUrl={pageQuery.data.ogImageId
			? buildAssetUrl(pageQuery.data.ogImageId, { width: 1200, height: 630, fit: 'cover' })
			: undefined}
	/>
{/if}

{#each sections as section (section.key)}
	{#if section.key === 'hero' && settingsQuery.data}
		<Hero
			blocks={section.data.blocks}
			advantages={section.data.advantages}
			links={section.data.links}
			phone={settingsQuery.data.phone}
			shader={section.shader}
			directusAttr={editAttr('section_hero_translations', section.data.translationId, [
				'tiles',
				'advantages',
				'links'
			])}
		/>
	{:else if section.key === 'services'}
		<Services
			title={section.data.title}
			items={section.data.items}
			shader={section.shader}
			directusAttr={editAttr('section_services_translations', section.data.translationId, [
				'title',
				'items'
			])}
		/>
	{:else if section.key === 'symptoms'}
		<Symptoms
			title={section.data.title}
			subtitle={section.data.subtitle}
			symptoms={section.data.symptoms}
			slider={section.data.slider}
			catLabel={section.data.catLabel}
			dogLabel={section.data.dogLabel}
			catIconName={section.data.catIconName}
			dogIconName={section.data.dogIconName}
			shader={section.shader}
			directusAttr={editAttr('section_symptoms_translations', section.data.translationId, [
				'title',
				'subtitle',
				'symptoms',
				'cat_label',
				'dog_label'
			])}
		/>
	{:else if section.key === 'we_help'}
		<WeHelp
			title={section.data.title}
			items={section.data.items}
			slider={section.data.slider}
			shader={section.shader}
			directusAttr={editAttr('section_we_help_translations', section.data.translationId, [
				'title',
				'items'
			])}
		/>
	{:else if section.key === 'contacts' && settingsQuery.data}
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
{/each}
