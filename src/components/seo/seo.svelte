<script lang="ts">
	import { PUBLIC_SITE_URL } from '$env/static/public';
	import { getLocale, locales, localizeHref } from '$lib/paraglide/runtime';

	let {
		title,
		description,
		siteName,
		path,
		ogImageUrl,
		noindex = false
	}: {
		title: string;
		description?: string;
		siteName: string;
		/** Locale-less pathname, e.g. "/" or "/services" */
		path: string;
		ogImageUrl?: string;
		noindex?: boolean;
	} = $props();

	const locale = $derived(getLocale());
	const canonical = $derived(`${PUBLIC_SITE_URL}${localizeHref(path, { locale })}`);
	const fullTitle = $derived(`${title} — ${siteName}`);
</script>

<svelte:head>
	<title>{fullTitle}</title>
	{#if description}
		<meta name="description" content={description} />
	{/if}
	<meta name="robots" content={noindex ? 'noindex, nofollow' : 'index, follow'} />
	<link rel="canonical" href={canonical} />
	{#each locales as loc (loc)}
		<link rel="alternate" hreflang={loc} href={`${PUBLIC_SITE_URL}${localizeHref(path, { locale: loc })}`} />
	{/each}
	<link rel="alternate" hreflang="x-default" href={`${PUBLIC_SITE_URL}${localizeHref(path, { locale: 'ru' })}`} />

	<meta property="og:type" content="website" />
	<meta property="og:title" content={fullTitle} />
	{#if description}
		<meta property="og:description" content={description} />
	{/if}
	<meta property="og:site_name" content={siteName} />
	<meta property="og:url" content={canonical} />
	<meta property="og:locale" content={locale === 'kk' ? 'kk_KZ' : 'ru_RU'} />
	{#if ogImageUrl}
		<meta property="og:image" content={ogImageUrl} />
	{/if}

	<meta name="twitter:card" content={ogImageUrl ? 'summary_large_image' : 'summary'} />
	<meta name="twitter:title" content={fullTitle} />
	{#if description}
		<meta name="twitter:description" content={description} />
	{/if}
	{#if ogImageUrl}
		<meta name="twitter:image" content={ogImageUrl} />
	{/if}
</svelte:head>
