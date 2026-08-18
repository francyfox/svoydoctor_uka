<script lang="ts">
	import { Splide, SplideSlide } from '@splidejs/svelte-splide';
	import '@splidejs/svelte-splide/css/splide-core.min.css';
	import type { Options, Splide as SplideInstance } from '@splidejs/splide';
	import { cn } from '$lib/utils.js';
	import type { SliderOptions, WeHelpItem } from '$lib/types/content';
	import { Card, CardContent, CardTitle, CardDescription } from '$components/ui/card/index.js';
	import { TileLink } from '$components/ui/tile-link/index.js';
	import { buttonVariants } from '$components/ui/button/index.js';
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

	const fragment = $derived(resolveShaderScene(shader, 'mosaic'));
	const startIndex = $derived(Math.max(items.findIndex((item) => item.featured), 0));

	// Official Splide "thumbnail carousel" recipe: two synced instances, the thumb
	// slider marked `isNavigation` handles click-to-navigate on its own — hover-to-navigate
	// (`thumbCard`'s onmouseenter below) is the one bit that's custom on top of it.
	let mainSplide: SplideInstance | undefined = $state();
	let thumbSplide: SplideInstance | undefined = $state();

	$effect(() => {
		if (mainSplide && thumbSplide) mainSplide.sync(thumbSplide);
	});

	const mainOptions: Options = $derived({
		type: 'fade',
		rewind: true,
		height: 400,
		arrows: false,
		pagination: false,
		drag: false,
		start: startIndex,
		autoplay: slider.autoplay,
		speed: slider.speed,
		interval: slider.interval
	});

	// Splide always reserves track space for a full `perPage` slides regardless of how many
	// actually exist — with fewer than 4 items that left an empty slot's worth of width/height
	// at the trailing edge (visibly left-aligned on the mobile filmstrip instead of centered).
	// Capping perPage at the real item count makes the slides fill the track exactly when
	// there's nothing to scroll through, and only falls back to 4-at-a-time once there's
	// enough content to actually need scrolling.
	const thumbPerPage = $derived(Math.min(items.length, 4));

	// Vertical thumb strip on desktop (matches the `lg:grid-cols-[2fr_1fr]` layout below);
	// below `lg` (1024px) it flips to a horizontal filmstrip — `thumbCard` renders only the
	// photo in that mode (mobile has no room for title/description in a thumbnail).
	const thumbOptions: Options = $derived({
		direction: 'ttb',
		height: '100%',
		perPage: thumbPerPage,
		gap: '0.5rem',
		pagination: false,
		arrows: false,
		isNavigation: true,
		drag: true,
		start: startIndex,
		breakpoints: {
			// `fixedWidth` matches thumbCard's mobile `size-20` (80px) square exactly, so each
			// slide's box is as wide as its actual content — with the dynamic perPage above this
			// alone would've been enough to stop reserving a phantom slot, but perPage-based sizing
			// still divides the *whole* track evenly among slides, leaving each real thumb padded
			// out to `track / count` width. `fixedWidth` sizes slides to content instead (it wins
			// over `perPage` — see cssSlideWidth() in Splide's own source, fixedWidth is checked
			// first); centering the still-possibly-narrower-than-track row is done in CSS below.
			1023: { direction: 'ltr', height: 'auto', fixedWidth: 80 }
		}
	});
</script>

{#snippet mainSlide(item: WeHelpItem)}
	<div class="tile-frame relative flex h-full items-end overflow-hidden">
		<Image id={item.photoId} alt={item.photoAlt ?? ''} width={720} height={560} />
		<div class="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent"></div>
		<div class="relative flex w-full h-full flex-col justify-end gap-4 p-6">
			<div class="w-full flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
				<div class="flex flex-col gap-2">
					<h3 class="font-heading text-2xl text-white lg:text-[length:var(--font-tile-h3)]">
						{item.title}
					</h3>
					{#if item.description}
						<p class="text-white/85">{item.description}</p>
					{/if}
				</div>
				{#if item.ctaLabel && item.link}
					<TileLink href={item.link} class={cn(buttonVariants(), 'mt-auto flex lg:shrink-0 text-xl')}>
						{item.ctaLabel}
					</TileLink>
				{/if}
			</div>
		</div>
	</div>
{/snippet}

{#snippet thumbCard(item: WeHelpItem, i: number)}
	<!-- onmouseenter is a hover-preview affordance on top of Splide's own click-to-navigate
	     (isNavigation on thumbSplide) — the slide's own <li> already carries the real
	     interactive semantics, this div just adds the extra hover trigger. -->
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div onmouseenter={() => mainSplide?.go(i)} class="h-full">
		<Card class="hidden h-full flex-row overflow-hidden lg:flex">
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
		<div
			class="tile-frame relative block size-20 shrink-0 overflow-hidden bg-[color:var(--color-photo-placeholder)] lg:hidden"
		>
			<Image id={item.photoId} alt={item.photoAlt ?? ''} width={80} height={80} />
		</div>
	</div>
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
				{#if items.length > 1}
					<div class="relative min-h-80 lg:min-h-[28rem]">
						<Splide bind:splide={mainSplide} options={mainOptions}>
							{#each items as item (item.id)}
								<SplideSlide>{@render mainSlide(item)}</SplideSlide>
							{/each}
						</Splide>
					</div>

					<div class="we-help-thumbs lg:h-full">
						<Splide bind:splide={thumbSplide} options={thumbOptions}>
							{#each items as item, i (item.id)}
								<SplideSlide>{@render thumbCard(item, i)}</SplideSlide>
							{/each}
						</Splide>
					</div>
				{:else}
					<div class="relative min-h-80 lg:min-h-[28rem]">
						{@render mainSlide(items[0])}
					</div>
				{/if}
			</div>
		</Reveal>
	</section>
{/if}

<style>
	/* isNavigation thumb slides get `.is-active` from Splide itself — dim the rest so the
	   thumb strip visibly doubles as pagination (the ask this whole redesign is for). */
	.we-help-thumbs :global(.splide__slide) {
		cursor: pointer;
		opacity: 0.6;
		transition: opacity 0.3s;
	}
	.we-help-thumbs :global(.splide__slide.is-active),
	.we-help-thumbs :global(.splide__slide:hover) {
		opacity: 1;
	}

	/* Below `lg` the thumb strip uses fixedWidth (see thumbOptions) — with few enough items
	   the row is narrower than the track and Splide's flex list left-aligns it by default;
	   center it instead. Splide positions the list via transform on top of this normal flex
	   layout, so this doesn't fight its own drag/position math. */
	@media (max-width: 1023px) {
		.we-help-thumbs :global(.splide__list) {
			justify-content: center;
		}
	}
</style>
