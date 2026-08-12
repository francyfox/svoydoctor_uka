<script lang="ts">
	import * as m from '$lib/paraglide/messages.js';
	import { Image } from '$components/ui/image/index.js';
	import PhoneLink from '$components/header/phone-link.svelte';

	let {
		siteName,
		phone,
		address,
		logoId,
		logoAlt
	}: {
		siteName: string;
		phone: string;
		address?: string;
		logoId?: string;
		logoAlt?: string;
	} = $props();
</script>

<div
	data-slot="maintenance"
	class="bg-secondary flex min-h-dvh flex-col items-center justify-center gap-6 px-4 py-10 text-center"
>
	<span class="bg-primary relative size-16 shrink-0 overflow-hidden rounded-full">
		<Image id={logoId} alt={logoAlt ?? ''} width={64} height={64} priority />
	</span>

	<div class="flex flex-col gap-2">
		<h1 class="font-heading text-3xl lg:text-[length:var(--font-tile-h2)]">{siteName}</h1>
		<h2 class="text-muted-foreground text-xl">{m.maintenance_title()}</h2>
	</div>

	<p class="max-w-md text-base">{m.maintenance_message()}</p>

	<div class="flex flex-col items-center gap-1">
		<PhoneLink {phone} class="text-2xl" />
		{#if address}
			<p class="text-muted-foreground text-sm">{address}</p>
		{/if}
	</div>
</div>
