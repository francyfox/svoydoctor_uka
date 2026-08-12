<script lang="ts">
	import { cn } from '$lib/utils.js';
	import type { SliderOptions, WeHelpItem } from '$lib/types/content';
	import { Slider } from '$components/ui/slider/index.js';
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

	const fragment = $derived(resolveShaderScene(shader, 'mosaic'));
</script>

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

			<Slider
				{items}
				autoplay={slider.autoplay}
				speed={slider.speed}
				interval={slider.interval}
			>
				{#snippet card(item: WeHelpItem)}
					<TileLink href={item.link} class="block w-64 sm:w-72">
						<Card class="h-full overflow-hidden">
							<div
								class="relative h-40 w-full overflow-hidden bg-[color:var(--color-photo-placeholder)]"
							>
								<Image id={item.photoId} alt={item.photoAlt ?? ''} width={288} height={160} />
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
		</Reveal>
	</section>
{/if}
