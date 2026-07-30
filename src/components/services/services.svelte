<script lang="ts">
	import { resolve } from '$app/paths';
	import type { Pathname } from '$app/types';
	import { localizeHref } from '$lib/paraglide/runtime';
	import { cn } from '$lib/utils.js';
	import type { ServiceItem } from '$lib/types/content';
	import * as m from '$lib/paraglide/messages.js';
	import { AccordionStrip } from '$components/ui/accordion-strip/index.js';

	type StripItem = ServiceItem & { id: string; label: string };

	let {
		items,
		editToken,
		class: className
	}: {
		items: ServiceItem[];
		editToken?: string;
		class?: string;
	} = $props();

	const stripItems = $derived(
		items.map((item): StripItem => ({ ...item, id: item.label, label: item.label }))
	);
</script>

{#if stripItems.length > 0}
	<section
		id="services"
		data-slot="services"
		class={cn('py-2', className)}
		data-squidex-token={editToken}
	>
		<div class="container">
			<AccordionStrip items={stripItems} class="tile-frame">
				{#snippet content(item: StripItem)}
					<div class="flex h-full flex-col gap-4 sm:flex-row">
						<div
							class="relative h-28 w-full shrink-0 overflow-hidden bg-[color:var(--color-photo-placeholder)] sm:h-full sm:w-48"
						>
							{#if item.illustrationUrl}
								<img src={item.illustrationUrl} alt="" class="size-full object-cover" />
							{:else}
								<span class="absolute inset-0 flex items-end p-3 text-sm text-[#3A3A3D]">
									{m.services_illustration_placeholder()}
								</span>
							{/if}
						</div>
						<div class="flex flex-1 flex-col justify-between gap-4">
							{#if item.description}
								<p>{item.description}</p>
							{/if}
							<a
								href={resolve(localizeHref('/apply') as Pathname)}
								class="font-heading self-start bg-primary px-6 py-3 text-base text-white"
							>
								{item.ctaLabel}
							</a>
						</div>
					</div>
				{/snippet}
			</AccordionStrip>
		</div>
	</section>
{/if}
