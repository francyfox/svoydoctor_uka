<script lang="ts">
	import { cn } from '$lib/utils.js';
	import type { ServiceItem } from '$lib/types/content';
	import { AccordionStrip } from '$components/ui/accordion-strip/index.js';
	import { ApplyButton } from '$components/ui/apply-button/index.js';
	import { Image } from '$components/ui/image/index.js';
	import { Reveal } from '$components/ui/reveal/index.js';
	import { ShaderBackground } from '$components/ui/shader-background/index.js';
	import { resolveShaderScene } from '$lib/webgl/shaders/index.js';

	type StripItem = Omit<ServiceItem, 'id'> & { id: string };

	let {
		title,
		items,
		shader,
		directusAttr,
		class: className
	}: {
		title: string;
		items: ServiceItem[];
		shader?: string;
		directusAttr?: string;
		class?: string;
	} = $props();

	const fragment = $derived(resolveShaderScene(shader, 'flow'));

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
				<Image id={item.illustrationId} alt={item.illustrationAlt ?? ''} width={192} height={256} />
			</div>
		{/if}

		<div class="flex h-full flex-col gap-4">
			{#if item.description}
				<p class="text-lg lg:text-[length:var(--font-tile-h3)]">{item.description}</p>
			{/if}
			<ApplyButton
					href="#apply"
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
		<ShaderBackground class="absolute inset-0" {fragment} />

		<Reveal class="container relative flex flex-col gap-6">
			<h2 class="font-heading text-3xl text-white lg:text-[length:var(--font-tile-h2)]">{title}</h2>

			<div class="sm:hidden">
				<AccordionStrip items={stripItems} {content} mode="vertical" />
			</div>

			<div class="hidden flex-col gap-4 sm:flex lg:hidden">
				<AccordionStrip items={firstHalf} {content} />
				{#if secondHalf.length > 0}
					<AccordionStrip items={secondHalf} {content} />
				{/if}
			</div>

			<div class="hidden lg:flex">
				<AccordionStrip items={stripItems} {content} />
			</div>
		</Reveal>
	</section>
{/if}
