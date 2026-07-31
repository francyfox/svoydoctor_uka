<script lang="ts">
	import { cn, whatsappHref } from '$lib/utils.js';
	import type { HeroBlock, HeroAdvantage } from '$lib/types/content';
	import * as m from '$lib/paraglide/messages.js';
	import { IconLink } from '$components/ui/icon-link/index.js';
	import HeroTileTitle from './hero-tile-title.svelte';
	import HeroTilePhoto from './hero-tile-photo.svelte';
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

	const [title, photo, promo] = $derived(blocks);
</script>

<section data-slot="hero" class={cn('h-[calc(100vh-200px)] py-2', className)} data-directus={directusAttr}>
	<div class="container h-full">
		<div
			class="h-full grid auto-rows-[174px] grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-8 lg:grid-rows-4"
		>
			{#if title}
				<HeroTileTitle
						title={title.title}
						description={title.description}
						link={title.link}
						class="col-span-2 row-span-2 sm:col-span-4 lg:col-span-4 lg:row-span-4"
				/>
			{/if}

			<HeroTilePhoto
					imageUrl={photo?.backgroundImageUrl}
					link={photo?.link}
					placeholder={m.hero_photo_placeholder()}
					placeholderClass="text-lg"
					class="col-span-1 row-span-2 sm:col-span-2 lg:col-start-5 lg:col-span-2"
			/>

			{#if promo}
				<HeroTilePromo
						title={promo.title}
						link={promo.link}
						class="col-span-1 row-span-2 sm:col-span-2 lg:col-start-7 lg:col-span-2"
				/>
			{/if}

			<IconLink
					icon="whatsapp"
					href={whatsappHref(phone)}
					label="WhatsApp"
					class="tile-frame bg-success lg:col-start-5 lg:row-start-3"
			/>

			<IconLink
					icon="instagram"
					href={instagramUrl}
					label="Instagram"
					class="tile-frame bg-[color:var(--color-brand-primary-dark)] lg:col-start-6 lg:row-start-3"
			/>

			<HeroTileAdvantages
					{advantages}
					class="col-span-2 row-span-1 sm:row-span-2 lg:col-start-7 lg:col-span-2 lg:row-start-3 lg:row-span-2"
			/>

			<HeroTilePhoto
					placeholder={m.hero_photo2_placeholder()}
					placeholderClass="text-sm"
					class="col-span-2 row-span-1 lg:col-start-5 lg:col-span-2 lg:row-start-4 lg:row-span-1"
			/>
		</div>

		<HeroActionBar applyHref={title?.link} />
	</div>
</section>
