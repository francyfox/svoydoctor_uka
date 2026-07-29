<script lang="ts">
	import { page } from '$app/state';
	import { resolve } from '$app/paths';
	import type { Pathname } from '$app/types';
	import { locales, localizeHref, getLocaleForUrl } from '$lib/paraglide/runtime';
	import * as m from '$lib/paraglide/messages.js';
	import { cn } from '$lib/utils.js';

	let {
		variant = 'pill'
	}: {
		variant?: 'pill' | 'tab';
	} = $props();

	const currentLocale = $derived(getLocaleForUrl(page.url));
</script>

<div class={cn('flex', variant === 'tab' && 'border-border border')}>
	{#each locales as locale (locale)}
		<a
			href={resolve(localizeHref(page.url.pathname, { locale }) as Pathname)}
			aria-current={currentLocale === locale ? 'page' : undefined}
			title={m.nav_language()}
			class={cn(
				'text-center font-normal uppercase',
				variant === 'pill'
					? 'flex h-16 w-[92px] items-center justify-center text-[36px]'
					: 'flex-1 px-2.5 py-2 text-xs font-semibold',
				currentLocale === locale
					? 'bg-primary text-primary-foreground'
					: variant === 'pill'
						? 'bg-secondary text-foreground'
						: 'text-foreground'
			)}
		>
			{locale}
		</a>
	{/each}
</div>
