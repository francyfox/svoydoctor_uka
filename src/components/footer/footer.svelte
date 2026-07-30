<script lang="ts">
	import { resolve } from '$app/paths';
	import type { Pathname } from '$app/types';
	import { localizeHref } from '$lib/paraglide/runtime';
	import { cn } from '$lib/utils.js';
	import * as m from '$lib/paraglide/messages.js';

	let {
		siteName,
		logoUrl,
		class: className
	}: {
		siteName: string;
		logoUrl?: string;
		class?: string;
	} = $props();

	const year = new Date().getFullYear();
</script>

<footer
	data-slot="footer"
	class={cn('bg-[color:var(--color-brand-primary-dark)] py-8 text-white', className)}
>
	<div class="container flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
		<a
			href={resolve(localizeHref('/') as Pathname)}
			class="flex shrink-0 items-center gap-3"
		>
			<span class="bg-primary size-11 shrink-0 overflow-hidden rounded-full">
				{#if logoUrl}
					<img src={logoUrl} alt="" class="size-full object-cover" />
				{/if}
			</span>
			<span class="font-heading text-xl whitespace-nowrap">{siteName}</span>
		</a>

		<p class="text-sm text-white/70">{m.footer_copyright({ year, siteName })}</p>
	</div>
</footer>
