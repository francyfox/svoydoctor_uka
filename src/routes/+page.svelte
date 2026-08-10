<script lang="ts">
	import { createQuery } from '@tanstack/svelte-query';
	import { page } from '$app/state';
	import { Hero } from '$components/hero/index.js';
	import { Services } from '$components/services/index.js';
	import { Symptoms } from '$components/symptoms/index.js';
	import { WeHelp } from '$components/we-help/index.js';
	import { Contacts } from '$components/contacts/index.js';
	import { UFooter } from '$components/footer/index.js';
	import { heroQueryOptions } from '$lib/queries/hero';
	import { servicesQueryOptions } from '$lib/queries/services';
	import { symptomsQueryOptions } from '$lib/queries/symptoms';
	import { weHelpQueryOptions } from '$lib/queries/we-help';
	import { settingsQueryOptions } from '$lib/queries/settings';
	import { getLocaleForUrl } from '$lib/paraglide/runtime';
	import { setAttr } from '$lib/visual-editor';

	let { data } = $props();

	function editAttr(collection: string, item: number | undefined, fields: string[]) {
		return item ? setAttr({ collection, item, fields, mode: 'drawer' as const }) : undefined;
	}

	const heroQuery = createQuery(
		() => heroQueryOptions(getLocaleForUrl(page.url)),
		() => data.queryClient
	);
	const servicesQuery = createQuery(
		() => servicesQueryOptions(getLocaleForUrl(page.url)),
		() => data.queryClient
	);
	const symptomsQuery = createQuery(
		() => symptomsQueryOptions(getLocaleForUrl(page.url)),
		() => data.queryClient
	);
	const weHelpQuery = createQuery(
		() => weHelpQueryOptions(getLocaleForUrl(page.url)),
		() => data.queryClient
	);
	const settingsQuery = createQuery(
		() => settingsQueryOptions(getLocaleForUrl(page.url)),
		() => data.queryClient
	);
</script>

{#if heroQuery.data && settingsQuery.data}
	<Hero
		blocks={heroQuery.data.blocks}
		advantages={heroQuery.data.advantages}
		links={heroQuery.data.links}
		phone={settingsQuery.data.phone}
		directusAttr={editAttr('section_hero_translations', heroQuery.data.translationId, [
			'blocks',
			'advantages',
			'links'
		])}
	/>
{/if}

{#if servicesQuery.data}
	<Services
		items={servicesQuery.data.items}
		directusAttr={editAttr('section_services_translations', servicesQuery.data.translationId, [
			'items'
		])}
	/>
{/if}

{#if symptomsQuery.data}
	<Symptoms
		title={symptomsQuery.data.title}
		subtitle={symptomsQuery.data.subtitle}
		symptoms={symptomsQuery.data.symptoms}
		directusAttr={editAttr('section_symptoms_translations', symptomsQuery.data.translationId, [
			'title',
			'subtitle',
			'symptoms'
		])}
	/>
{/if}

{#if weHelpQuery.data}
	<WeHelp
		title={weHelpQuery.data.title}
		items={weHelpQuery.data.items}
		directusAttr={editAttr('section_we_help_translations', weHelpQuery.data.translationId, [
			'title',
			'items'
		])}
	/>
{/if}

{#if settingsQuery.data}
	<Contacts
		address={settingsQuery.data.address}
		hoursWeekday={settingsQuery.data.hoursWeekday}
		hoursSaturday={settingsQuery.data.hoursSaturday}
		offDays={settingsQuery.data.offDays}
		ratingValue={settingsQuery.data.ratingValue}
		ratingLabel={settingsQuery.data.ratingLabel}
		reviewsUrl={settingsQuery.data.reviewsUrl}
		mapEmbedUrl={settingsQuery.data.mapEmbedUrl}
		clinicPhotoId={settingsQuery.data.clinicPhotoId}
		clinicPhotoAlt={settingsQuery.data.clinicPhotoAlt}
		directusAttr={editAttr('settings_translations', settingsQuery.data.translationId, [
			'address',
			'hours_weekday',
			'hours_saturday',
			'rating_label'
		])}
	/>

	<UFooter
		siteName={settingsQuery.data.siteName}
		logoId={settingsQuery.data.logoId}
		logoAlt={settingsQuery.data.logoAlt}
	/>
{/if}
