<script lang="ts">
	import { resolve } from '$app/paths';
	import type { Pathname } from '$app/types';
	import { localizeHref } from '$lib/paraglide/runtime';
	import { cn } from '$lib/utils.js';
	import type { ServiceItem } from '$lib/types/content';
	import { AccordionStrip } from '$components/ui/accordion-strip/index.js';
	import { ApplyButton } from '$components/ui/apply-button/index.js';
	import { Image } from '$components/ui/image/index.js';
	import { Reveal } from '$components/ui/reveal/index.js';
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
	const splitIndex = $derived(Math.ceil(stripItems.length / 2));
	const firstHalf = $derived(stripItems.slice(0, splitIndex));
	const secondHalf = $derived(stripItems.slice(splitIndex));
</script>

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
				<p class="text-lg lg:text-[length:var(--font-tile-h3)]">{item.description}</p>
			{/if}
			<ApplyButton
					href={resolve(localizeHref('/apply') as Pathname)}
					class="self-start px-6 py-3 text-lg uppercase"
			>
				{item.ctaLabel}
			</ApplyButton>
		</div>
	</div>
{/snippet}

{#if stripItems.length > 0}
	<section
		id="services"
		data-slot="services"
		class={cn('bg-violet-950 relative flex min-h-dvh flex-col justify-center overflow-hidden py-2', className)}
		data-directus={directusAttr}
	>
		<ShaderBackground class="absolute inset-0" fragment={flowShader} />

		<Reveal class="container relative">
			<!-- <640px: не влезает даже 2-3 таба по 60px + контент — обычный вертикальный аккордеон,
			     раскрытие вниз вместо вбок (CSS grid-template-rows trick, без JS-измерения высоты). -->
			<div class="sm:hidden">
				<AccordionStrip items={stripItems} {content} mode="vertical" />
			</div>

			<!-- 640–1024px: два горизонтальных аккордеона по половине услуг — одному не хватает
			     ширины на все табы + открытую панель одновременно. -->
			<div class="hidden flex-col gap-4 sm:flex lg:hidden">
				<AccordionStrip items={firstHalf} {content} />
				{#if secondHalf.length > 0}
					<AccordionStrip items={secondHalf} {content} />
				{/if}
			</div>

			<!-- 1024px+: один горизонтальный аккордеон на все услуги, ширины хватает. -->
			<div class="hidden lg:flex">
				<AccordionStrip items={stripItems} {content} />
			</div>
		</Reveal>
	</section>
{/if}
