<script lang="ts">
	import { cn } from '$lib/utils.js';
	import type { SectionServicesPricelist } from '$lib/types/content';
	import * as m from '$lib/paraglide/messages.js';
	import { Reveal } from '$components/ui/reveal/index.js';
	import * as Accordion from '$components/ui/accordion/index.js';

	let {
		title,
		note,
		categories,
		directusAttr,
		class: className
	}: {
		title: string;
		note?: string;
		categories: SectionServicesPricelist['categories'];
		directusAttr?: string;
		class?: string;
	} = $props();

	function formatPrice(price: number): string {
		return `${price.toLocaleString('ru-RU')} ₸`;
	}
</script>

{#if categories.length > 0}
	<section data-slot="services-price-list" class={cn('py-10 lg:py-16', className)}>
		<Reveal class="container flex flex-col gap-4">
			<h2 class="font-heading text-2xl lg:text-[length:var(--font-tile-h2)]">{title}</h2>
			{#if note}
				<p class="text-muted-foreground max-w-2xl text-base">{note}</p>
			{/if}

			<Accordion.Root type="multiple" class="tile-frame bg-card" data-directus={directusAttr}>
				{#each categories as category (category.id)}
					<Accordion.Item value={String(category.id)} class="px-4">
						<Accordion.Trigger class="rounded-none font-heading text-lg">
							{category.title}
						</Accordion.Trigger>
						<Accordion.Content>
							<div class="overflow-x-auto">
								<table class="w-full text-left text-sm">
									<thead class="sr-only">
										<tr>
											<th scope="col">{m.services_price_table_service()}</th>
											<th scope="col">{m.services_price_table_price()}</th>
										</tr>
									</thead>
									<tbody>
										{#each category.items as item (item.id)}
											<tr class="border-border/60 not-last:border-b">
												<td class="py-2 pr-4">{item.label}</td>
												<td class="py-2 text-right font-medium whitespace-nowrap">{formatPrice(item.price)}</td>
											</tr>
										{/each}
									</tbody>
								</table>
							</div>
						</Accordion.Content>
					</Accordion.Item>
				{/each}
			</Accordion.Root>
		</Reveal>
	</section>
{/if}
