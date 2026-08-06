<script lang="ts">
	import { resolve } from '$app/paths';
	import type { Pathname } from '$app/types';
	import { localizeHref } from '$lib/paraglide/runtime';
	import { Image } from '$components/ui/image/index.js';

	let {
		siteName,
		logoId
	}: {
		siteName: string;
		logoId?: string;
	} = $props();
</script>

<a href={resolve(localizeHref('/') as Pathname)} class="flex shrink-0 items-center gap-3 lg:gap-5">
	<span class="bg-primary relative size-11 shrink-0 overflow-hidden rounded-full lg:size-[72px]">
		<Image id={logoId} alt="" width={72} height={72} priority />
	</span>
	<span
		class="font-heading text-foreground text-2xl whitespace-nowrap lg:text-[length:var(--font-tile-h2)]"
	>
		{siteName}
	</span>
</a>