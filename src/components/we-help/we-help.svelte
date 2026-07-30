<script lang="ts">
	import { cn } from '$lib/utils.js';
	import type { WeHelpItem } from '$lib/types/content';
	import * as m from '$lib/paraglide/messages.js';
	import { Slider } from '$components/ui/slider/index.js';
	import { Card, CardContent, CardTitle, CardDescription } from '$components/ui/card/index.js';
	import { TileLink } from '$components/ui/tile-link/index.js';

	let {
		title,
		items,
		editToken,
		class: className
	}: {
		title: string;
		items: WeHelpItem[];
		editToken?: string;
		class?: string;
	} = $props();
</script>

<section
	id="we-help"
	data-slot="we-help"
	class={cn('py-10 lg:py-16', className)}
	data-squidex-token={editToken}
>
	<div class="container flex flex-col gap-6">
		<h2 class="font-heading text-3xl lg:text-[length:var(--font-tile-h2)]">{title}</h2>

		{#if items.length > 0}
			<Slider {items}>
				{#snippet card(item: WeHelpItem)}
					<TileLink href={item.link} class="block w-64 sm:w-72">
						<Card class="h-full overflow-hidden">
							<div
								class="relative h-40 w-full overflow-hidden bg-[color:var(--color-photo-placeholder)]"
							>
								{#if item.photoUrl}
									<img src={item.photoUrl} alt="" class="size-full object-cover" />
								{:else}
									<span class="absolute inset-0 flex items-end p-3 text-sm text-[#3A3A3D]">
										{m.we_help_photo_placeholder()}
									</span>
								{/if}
							</div>
							<CardContent class="flex flex-col gap-1">
								<CardTitle>{item.title}</CardTitle>
								{#if item.description}
									<CardDescription>{item.description}</CardDescription>
								{/if}
							</CardContent>
						</Card>
					</TileLink>
				{/snippet}
			</Slider>
		{/if}
	</div>
</section>
