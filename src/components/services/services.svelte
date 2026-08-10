<script lang="ts">
	import { resolve } from '$app/paths';
	import type { Pathname } from '$app/types';
	import { localizeHref } from '$lib/paraglide/runtime';
	import { cn } from '$lib/utils.js';
	import type { ServiceItem } from '$lib/types/content';
	import { AccordionStrip } from '$components/ui/accordion-strip/index.js';
	import { Image } from '$components/ui/image/index.js';
	import { ShaderBackground } from '$components/ui/shader-background/index.js';
	import flowShader from '$lib/webgl/shaders/flow.frag.glsl?raw';

	type StripItem = Omit<ServiceItem, 'id'> & { id: string };

	let {
		items,
		directusAttr,
		class: className
	}: {
		items: ServiceItem[];
		directusAttr?: string;
		class?: string;
	} = $props();

	const stripItems = $derived(items.map((item): StripItem => ({ ...item, id: String(item.id) })));
</script>

{#if stripItems.length > 0}
	<section
		id="services"
		data-slot="services"
		class={cn('bg-violet-950 relative flex min-h-dvh flex-col justify-center overflow-hidden py-2', className)}
		data-directus={directusAttr}
	>
		<ShaderBackground class="absolute inset-0" fragment={flowShader} />

		<div class="container relative">
			<div class="flex">
				<AccordionStrip items={stripItems}>
					{#snippet content(item: StripItem)}
						<div class="flex h-full flex-col gap-4 sm:flex-row">
							{#if item.illustrationId}
								<div
										class="relative !h-[256px] w-full shrink-0 overflow-hidden bg-[color:var(--color-photo-placeholder)] sm:h-full sm:w-48"
								>
									<Image id={item.illustrationId} alt="" width={192} height={256} />
								</div>
							{/if}

							<div class="flex h-full flex-col gap-4">
								{#if item.description}
									<p class="text-2xl">{item.description}</p>
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
		</div>
	</section>
{/if}
