<script lang="ts">
	import { resolve } from '$app/paths';
	import type { Pathname } from '$app/types';
	import { localizeHref } from '$lib/paraglide/runtime';
	import * as m from '$lib/paraglide/messages.js';
	import { ApplyButton } from '$components/ui/apply-button/index.js';
	import { Icon } from '$components/ui/icon/index.js';
	import * as Sheet from '$components/ui/sheet/index.js';
	import { navItems } from './header.data';
	import PhoneLink from './phone-link.svelte';
	import LocaleSwitch from './locale-switch.svelte';

	let {
		phone,
		applyHref
	}: {
		phone: string;
		applyHref: string;
	} = $props();

	let open = $state(false);
</script>

<Sheet.Root bind:open>
	<Sheet.Trigger>
		{#snippet child({ props })}
			<button
				{...props}
				type="button"
				aria-label={m.nav_menu_open()}
				class="bg-foreground flex size-11 shrink-0 items-center justify-center text-white lg:size-16"
			>
				<Icon name="menu" class="size-6 lg:size-8" />
			</button>
		{/snippet}
	</Sheet.Trigger>
	<Sheet.Content class="flex flex-col gap-6 p-6">
		<Sheet.Title class="sr-only">{m.nav_menu_open()}</Sheet.Title>
		<nav class="mt-8 flex flex-col gap-4">
			{#each navItems as item (item.path)}
				<a
					href={resolve(localizeHref(item.path) as Pathname)}
					class="text-lg font-medium"
					onclick={() => (open = false)}
				>
					{item.label()}
				</a>
			{/each}
		</nav>
		<PhoneLink {phone} class="text-xl lg:hidden" />
		<div class="lg:hidden">
			<LocaleSwitch variant="tab" />
		</div>
		<ApplyButton href={applyHref} class="px-6 py-3 text-base" onclick={() => (open = false)}>
			{m.cta_apply()}
		</ApplyButton>
	</Sheet.Content>
</Sheet.Root>
