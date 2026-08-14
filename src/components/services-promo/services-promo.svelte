<script lang="ts">
	import { cn } from '$lib/utils.js';
	import type { ServicesPromo } from '$lib/types/content';
	import * as m from '$lib/paraglide/messages.js';
	import { ApplyButton } from '$components/ui/apply-button/index.js';
	import { Reveal } from '$components/ui/reveal/index.js';

	let {
		promo,
		locale,
		directusAttr,
		class: className
	}: {
		promo: ServicesPromo | undefined;
		locale: string;
		directusAttr?: string;
		class?: string;
	} = $props();

	function formatPrice(price: number): string {
		return `${price.toLocaleString('ru-RU')} ₸`;
	}

	function formatDate(value: string): string {
		return new Intl.DateTimeFormat(locale === 'kk' ? 'kk-KZ' : 'ru-RU', {
			day: 'numeric',
			month: 'long'
		}).format(new Date(value));
	}
</script>

<section data-slot="services-promo" class={cn('bg-secondary py-10 lg:py-16', className)}>
	<Reveal class="container">
		{#if promo}
			<div
				class="tile-frame flex flex-col gap-6 bg-[color:var(--color-brand-primary)] p-8 text-white lg:flex-row lg:items-center lg:justify-between"
				data-directus={directusAttr}
			>
				<div class="flex flex-col gap-2">
					<h2 class="font-heading text-2xl">{promo.title}</h2>
					{#if promo.description}
						<p class="text-base text-white/80">{promo.description}</p>
					{/if}
					{#if promo.validUntil}
						<span class="w-fit bg-white/15 px-3 py-1 text-sm font-medium">
							{m.services_promo_valid_until({ date: formatDate(promo.validUntil) })}
						</span>
					{/if}
				</div>

				<div class="flex flex-wrap items-center gap-4">
					<div class="flex flex-col items-start">
						{#if promo.originalPrice}
							<span class="text-lg text-white/60 line-through">{formatPrice(promo.originalPrice)}</span>
						{/if}
						<span class="font-heading text-4xl text-[color:var(--color-brand-accent)]">
							{formatPrice(promo.price)}
						</span>
					</div>
					<ApplyButton href="#apply-sterilization" class="px-6 py-3 uppercase">
						{m.cta_apply()}
					</ApplyButton>
				</div>
			</div>
		{:else}
			<div
				class="tile-frame flex flex-col gap-4 bg-[color:var(--color-warning-bg)] p-8 text-[color:var(--color-warning-fg)] lg:flex-row lg:items-center lg:justify-between"
			>
				<div class="flex flex-col gap-1">
					<h2 class="font-heading text-2xl">{m.services_promo_fallback_title()}</h2>
					<p class="text-base">{m.services_promo_fallback_description()}</p>
				</div>
				<ApplyButton
					href="#apply-sterilization"
					class="w-fit bg-[color:var(--color-warning-fg)] px-6 py-3 uppercase text-white hover:bg-[color:var(--color-warning-fg)]/90"
				>
					{m.cta_apply()}
				</ApplyButton>
			</div>
		{/if}
	</Reveal>
</section>
