<script lang="ts">
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import * as Sheet from '$components/ui/sheet/index.js';
	import { DynamicForm } from '$components/dynamic-form/index.js';
	import type { QueryClient } from '@tanstack/svelte-query';

	let { phone, queryClient }: { phone: string; queryClient: QueryClient } = $props();

	const activeForm = $derived(
		page.url.hash === '#apply'
			? ('booking_requests' as const)
			: page.url.hash === '#apply-sterilization'
				? ('sterilization_requests' as const)
				: undefined
	);
	// Sheet.Root itself must always stay mounted — wrapping it in {#if activeForm} instead of
	// deriving `open` meant every fresh open() mounted the whole tree with open already true,
	// so Svelte never saw a false→true flip to animate (the sheet just appeared instantly).
	// Keeping Root mounted and toggling `open` reactively matches nav-menu.svelte's working
	// burger-menu pattern, where bind:open flips on an already-mounted component.
	const open = $derived(activeForm !== undefined);

	// href="#apply"/"#apply-sterilization" is a fragment on the current path — never a route
	// resolve() can express, so this stays as a plain path string like paraglide.svelte.ts's
	// goto(localizeUrl(...).href) does for the same reason.
	function close() {
		goto(page.url.pathname + page.url.search, { replaceState: true, noScroll: true, keepFocus: true });
	}
</script>

<Sheet.Root
	{open}
	onOpenChange={(next: boolean) => {
		if (!next) close();
	}}
>
	<Sheet.Content showCloseButton={false} class="overflow-y-auto p-8 data-[side=right]:sm:max-w-xl">
		{#if activeForm === 'booking_requests'}
			<DynamicForm collection="booking_requests" title="Записаться на приём" {phone} {queryClient} onClose={close} />
		{:else if activeForm === 'sterilization_requests'}
			<DynamicForm
				collection="sterilization_requests"
				title="Запись на стерилизацию/кастрацию"
				{phone}
				{queryClient}
				onClose={close}
				note="Итоговая стоимость зависит от пола и веса питомца — точную сумму уточним при подтверждении записи."
			/>
		{/if}
	</Sheet.Content>
</Sheet.Root>
