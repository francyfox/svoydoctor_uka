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

	// href="#apply"/"#apply-sterilization" is a fragment on the current path — never a route
	// resolve() can express, so this stays as a plain path string like paraglide.svelte.ts's
	// goto(localizeUrl(...).href) does for the same reason.
	function close() {
		goto(page.url.pathname + page.url.search, { replaceState: true, noScroll: true, keepFocus: true });
	}
</script>

{#if activeForm}
	<Sheet.Root
		open={true}
		onOpenChange={(next: boolean) => {
			if (!next) close();
		}}
	>
		<Sheet.Content showCloseButton={false} class="overflow-y-auto bg-secondary p-8">
			{#if activeForm === 'booking_requests'}
				<DynamicForm collection="booking_requests" title="Записаться на приём" {phone} {queryClient} onClose={close} />
			{:else}
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
{/if}
