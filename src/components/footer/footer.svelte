<script lang="ts">
	import { resolve } from '$app/paths';
	import type { Pathname } from '$app/types';
	import { localizeHref } from '$lib/paraglide/runtime';
	import { cn } from '$lib/utils.js';
	import * as m from '$lib/paraglide/messages.js';
	import { Image } from '$components/ui/image/index.js';

	let {
		siteName,
		logoId,
		logoAlt,
		logoIsSvg = false,
		class: className
	}: {
		siteName: string;
		logoId?: string;
		logoAlt?: string;
		logoIsSvg?: boolean;
		class?: string;
	} = $props();

	const year = new Date().getFullYear();
</script>

<footer
	data-slot="footer"
	class={cn('bg-[color:var(--color-brand-primary-dark)] py-2 text-white', className)}
>
	<div class="container flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
		<a
			href={resolve(localizeHref('/') as Pathname)}
			class="hover-zoom flex shrink-0 items-center gap-3"
		>
			<span class="flex justify-center items-center bg-primary relative size-11 shrink-0 overflow-hidden rounded-full">
				<Image
				id={logoId}
				alt={logoAlt ?? ''}
				width={32}
				height={32}
				svg={logoIsSvg}
				class="!size-[32px] inset-auto"
			/>
			</span>
			<span class="font-heading text-xl whitespace-nowrap">{siteName}</span>
		</a>

		<p class="text-sm text-white/70">{m.footer_copyright({ year, siteName })}</p>
	</div>
</footer>
