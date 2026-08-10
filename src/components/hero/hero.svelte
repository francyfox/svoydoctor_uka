<script lang="ts">
	import { cn, whatsappHref } from '$lib/utils.js';
	import type { HeroBlock, HeroAdvantage } from '$lib/types/content';
	import { IconLink } from '$components/ui/icon-link/index.js';
	import { ShaderBackground } from '$components/ui/shader-background/index.js';
	import auraShader from '$lib/webgl/shaders/aura.frag.glsl?raw';
	import HeroTileTitle from './hero-tile-title.svelte';
	import HeroTileMedia from './hero-tile-media.svelte';
	import HeroTilePromo from './hero-tile-promo.svelte';
	import HeroTileAdvantages from './hero-tile-advantages.svelte';
	import HeroActionBar from './hero-action-bar.svelte';
	import { instagramUrl } from './hero.data';

	let {
		blocks,
		advantages,
		phone,
		directusAttr,
		class: className
	}: {
		blocks: HeroBlock[];
		advantages: HeroAdvantage[];
		phone: string;
		directusAttr?: string;
		class?: string;
	} = $props();

	const [title, photo, promo, description, media] = $derived(blocks);
</script>

<section
	data-slot="hero"
	class={cn('relative flex min-h-[calc(100dvh-86px)] flex-col overflow-hidden py-5', className)}
	data-directus={directusAttr}
>
	<ShaderBackground class="absolute inset-0" fragment={auraShader} />

	<div class="container relative flex flex-1 flex-col">
		<div
			class="grid flex-1 auto-rows-[174px] grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-8 lg:grid-rows-4"
		>
			{#if title}
				<HeroTileTitle
						title={title.title}
						description={title.description}
						link={title.link}
						background={title.background}
						class="col-span-2 row-span-2 sm:col-span-4 lg:col-span-4 lg:row-span-4"
				/>
			{/if}

			<HeroTileMedia
					background={photo?.background}
					link={photo?.link}
					class="col-span-1 row-span-2 sm:col-span-2 lg:col-start-5 lg:col-span-2"
			/>

			{#if promo}
				<HeroTilePromo
						title={promo.title}
						link={promo.link}
						backgroundId={promo.background?.id}
						class="col-span-1 row-span-2 sm:col-span-2 lg:col-start-7 lg:col-span-2"
				/>
			{/if}

			<IconLink
					icon="whatsapp"
					iconClass="size-12"
					href={whatsappHref(phone)}
					label="WhatsApp"
					class="tile-frame bg-success lg:col-start-5 lg:row-start-3"
			/>

			<IconLink
					icon="instagram"
					iconClass="size-12"
					href={instagramUrl}
					label="Instagram"
					class="tile-frame bg-[color:var(--color-brand-primary-dark)] lg:col-start-6 lg:row-start-3"
			/>

			<HeroTileAdvantages
					{advantages}
					class="col-span-2 row-span-1 sm:row-span-2 lg:col-start-7 lg:col-span-2 lg:row-start-3 lg:row-span-2"
			/>

			<HeroTileMedia
					background={media?.background}
					link={media?.link}
					class="col-span-2 row-span-1 lg:col-start-5 lg:col-span-2 lg:row-start-4 lg:row-span-1"
			/>
		</div>

		<HeroActionBar applyHref={title?.link} />
	</div>
</section>
