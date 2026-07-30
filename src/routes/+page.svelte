<script lang="ts">
	import { createQuery } from '@tanstack/svelte-query';
	import { page } from '$app/state';
	import { Hero } from '$components/hero/index.js';
	import { Services } from '$components/services/index.js';
	import { Symptoms } from '$components/symptoms/index.js';
	import { WeHelp } from '$components/we-help/index.js';
	import { Contacts } from '$components/contacts/index.js';
	import { Footer } from '$components/footer/index.js';
	import { heroQueryOptions } from '$lib/queries/hero';
	import { servicesQueryOptions } from '$lib/queries/services';
	import { symptomsQueryOptions } from '$lib/queries/symptoms';
	import { weHelpQueryOptions } from '$lib/queries/we-help';
	import { settingsQueryOptions } from '$lib/queries/settings';
	import { getLocaleForUrl } from '$lib/paraglide/runtime';
	import { isPreview } from '$lib/preview';

	let { data } = $props();

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

	const preview = $derived(isPreview());
</script>

{#if heroQuery.data && settingsQuery.data}
	<Hero
		blocks={heroQuery.data.blocks}
		advantages={heroQuery.data.advantages}
		phone={settingsQuery.data.phone}
		editToken={preview ? heroQuery.data.editToken : undefined}
	/>
{/if}

{#if servicesQuery.data}
	<Services
		items={servicesQuery.data.items}
		editToken={preview ? servicesQuery.data.editToken : undefined}
	/>
{/if}

{#if symptomsQuery.data}
	<Symptoms
		title={symptomsQuery.data.title}
		subtitle={symptomsQuery.data.subtitle}
		symptoms={symptomsQuery.data.symptoms}
		editToken={preview ? symptomsQuery.data.editToken : undefined}
	/>
{/if}

{#if weHelpQuery.data}
	<WeHelp
		title={weHelpQuery.data.title}
		items={weHelpQuery.data.items}
		editToken={preview ? weHelpQuery.data.editToken : undefined}
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
		clinicPhotoUrl={settingsQuery.data.clinicPhotoUrl}
		editToken={preview ? settingsQuery.data.editToken : undefined}
	/>

	<Footer siteName={settingsQuery.data.siteName} logoUrl={settingsQuery.data.logoUrl} />
{/if}
