<script lang="ts">
	import { fade } from 'svelte/transition';
	import { cn } from '$lib/utils.js';
	import type { SliderOptions, WeHelpItem } from '$lib/types/content';
	import { VerticalSlider } from '$components/ui/vertical-slider/index.js';
	import { Card, CardContent, CardTitle, CardDescription } from '$components/ui/card/index.js';
	import { TileLink } from '$components/ui/tile-link/index.js';
	import { Image } from '$components/ui/image/index.js';
	import { Reveal } from '$components/ui/reveal/index.js';
	import { ShaderBackground } from '$components/ui/shader-background/index.js';
	import { resolveShaderScene } from '$lib/webgl/shaders/index.js';

	let {
		title,
		items,
		slider,
		shader,
		directusAttr,
		class: className
	}: {
		title: string;
		items: WeHelpItem[];
		slider: SliderOptions;
		shader?: string;
		directusAttr?: string;
		class?: string;
	} = $props();

	let activeId = $state<number | undefined>(undefined);

	const fragment = $derived(resolveShaderScene(shader, 'mosaic'));
	const defaultFeatured = $derived(items.find((item) => item.featured) ?? items[0]);
	const featured = $derived(items.find((item) => item.id === activeId) ?? defaultFeatured);
	const rest = $derived(items.filter((item) => item.id !== featured?.id));
</script>

{#snippet smallCard(item: WeHelpItem)}
	<TileLink href={item.link} class="block" onmouseenter={() => (activeId = item.id)}>
		<Card class="flex-row overflow-hidden">
			<div class="relative h-24 w-24 shrink-0 overflow-hidden bg-[color:var(--color-photo-placeholder)]">
				<Image id={item.photoId} alt={item.photoAlt ?? ''} width={96} height={96} />
			</div>
			<CardContent class="flex flex-col justify-center gap-1 py-3">
				<CardTitle class="text-base">{item.title}</CardTitle>
				{#if item.description}
					<CardDescription class="line-clamp-2">{item.description}</CardDescription>
				{/if}
			</CardContent>
		</Card>
	</TileLink>
{/snippet}

{#if items.length > 0}
	<section
		id="we-help"
		data-slot="we-help"
		class={cn(
			'bg-[color:var(--color-brand-primary-dark)] relative flex min-h-dvh flex-col justify-center overflow-hidden py-10 lg:py-16',
			className
		)}
		data-directus={directusAttr}
	>
		<ShaderBackground class="absolute inset-0" {fragment} />

		<Reveal class="container relative flex flex-col gap-6">
			<h2 class="font-heading text-3xl text-secondary lg:text-[length:var(--font-tile-h2)]">{title}</h2>

			<div class="grid grid-cols-1 gap-4 lg:grid-cols-[2fr_1fr] lg:items-stretch">
				{#if featured}
					<TileLink
						href={featured.link}
						class="tile-frame group relative block min-h-80 overflow-hidden lg:min-h-[28rem]"
					>
						{#key featured.id}
							<div transition:fade={{ duration: 250 }}>
								<Image id={featured.photoId} alt={featured.photoAlt ?? ''} width={720} height={560} />
								<div class="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent"></div>
								<div class="relative flex h-full flex-col justify-end gap-2 p-6">
									<h3 class="font-heading text-2xl text-white lg:text-[length:var(--font-tile-h3)]">
										{featured.title}
									</h3>
									{#if featured.description}
										<p class="text-white/85">{featured.description}</p>
									{/if}
								</div>
							</div>
						{/key}
					</TileLink>
				{/if}

				{#if rest.length > 3}
					<VerticalSlider
						items={rest}
						card={smallCard}
						autoplay={slider.autoplay}
						speed={slider.speed}
						interval={slider.interval}
						class="lg:h-full"
					/>
				{:else if rest.length > 0}
					<div class="flex flex-col gap-3">
						{#each rest as item (item.id)}
							{@render smallCard(item)}
						{/each}
					</div>
				{/if}
			</div>
		</Reveal>
	</section>
{/if}
