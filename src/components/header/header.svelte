<script lang="ts">
	import { browser } from '$app/environment';
	import { resolve } from '$app/paths';
	import type { Pathname } from '$app/types';
	import { localizeHref } from '$lib/paraglide/runtime';
	import { cn, whatsappHref } from '$lib/utils.js';
	import { ScrollState } from 'runed';
	import { IconLink } from '$components/ui/icon-link/index.js';
	import Logo from './logo.svelte';
	import PhoneLink from './phone-link.svelte';
	import LocaleSwitch from './locale-switch.svelte';
	import NavMenu from './nav-menu.svelte';

	let {
		siteName,
		phone,
		logoUrl,
		directusAttr,
		class: className
	}: {
		siteName: string;
		phone: string;
		logoUrl?: string;
		directusAttr?: string;
		class?: string;
	} = $props();

	const applyHref = $derived(resolve(localizeHref('/apply') as Pathname));

	const scroll = new ScrollState({ element: () => (browser ? window : undefined) });
	const scrolled = $derived(!scroll.arrived.top);
</script>

<header
	data-slot="header"
	class={cn('sticky top-0 z-40 bg-background py-2 transition-shadow', className)}
	style={scrolled ? 'box-shadow: var(--shadow-glass)' : ''}
	data-directus={directusAttr}
>
	<div class="container flex items-center justify-between gap-4">
		<Logo {siteName} {logoUrl} />

		<div class="hidden items-center gap-7 lg:flex">
			<PhoneLink {phone} class="text-2xl lg:text-[length:var(--font-tile-h3)]" />
			<IconLink
				icon="whatsapp"
				href={whatsappHref(phone)}
				label="WhatsApp"
				class="bg-primary size-14 shrink-0"
			/>
			<LocaleSwitch variant="pill" />
		</div>

		<NavMenu {phone} {applyHref} />
	</div>
</header>
