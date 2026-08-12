<script lang="ts">
	import { cn } from '$lib/utils.js';
	import type { MapboxSettings } from '$lib/types/content';
	import * as m from '$lib/paraglide/messages.js';
	import { DaySquare, type DaySquareVariant } from '$components/ui/day-square/index.js';
	import { Image } from '$components/ui/image/index.js';
	import { MapboxMap } from '$components/ui/mapbox-map/index.js';
	import { Reveal } from '$components/ui/reveal/index.js';
	import { ShaderBackground } from '$components/ui/shader-background/index.js';
	import { resolveShaderScene } from '$lib/webgl/shaders/index.js';

	let {
		address,
		hoursWeekday,
		hoursSaturday,
		offDays,
		ratingValue,
		ratingLabel,
		reviewsUrl,
		mapbox,
		clinicPhotoId,
		clinicPhotoAlt,
		shader,
		directusAttr,
		class: className
	}: {
		address?: string;
		hoursWeekday?: string;
		hoursSaturday?: string;
		offDays: number[];
		ratingValue?: string;
		ratingLabel?: string;
		reviewsUrl?: string;
		mapbox?: MapboxSettings;
		clinicPhotoId?: string;
		clinicPhotoAlt?: string;
		shader?: string;
		directusAttr?: string;
		class?: string;
	} = $props();

	const fragment = $derived(resolveShaderScene(shader, 'spectrum'));

	const days = [
		{ dayIndex: 1, label: m.contacts_day_mon() },
		{ dayIndex: 2, label: m.contacts_day_tue() },
		{ dayIndex: 3, label: m.contacts_day_wed() },
		{ dayIndex: 4, label: m.contacts_day_thu() },
		{ dayIndex: 5, label: m.contacts_day_fri() },
		{ dayIndex: 6, label: m.contacts_day_sat() },
		{ dayIndex: 0, label: m.contacts_day_sun() }
	];

	const today = new Date().getDay();

	function variantFor(dayIndex: number): DaySquareVariant {
		if (offDays.includes(dayIndex)) return 'off';
		if (dayIndex === today) return 'today';
		return 'default';
	}
</script>

<section
	id="contacts"
	data-slot="contacts"
	class={cn(
		'relative flex min-h-dvh flex-col justify-center overflow-hidden py-10 lg:py-16',
		className
	)}
	data-directus={directusAttr}
>
	<ShaderBackground class="absolute inset-0" {fragment} />

	<Reveal class="container relative">
		<div class="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4 lg:grid-rows-2">
			<div class="tile-frame bg-secondary flex flex-col gap-4 p-6 lg:col-span-2">
				<h3 class="font-heading text-lg">{m.contacts_hours_title()}</h3>
				<div class="flex flex-wrap gap-1.5">
					{#each days as day (day.dayIndex)}
						<DaySquare variant={variantFor(day.dayIndex)}>{day.label}</DaySquare>
					{/each}
				</div>
				{#if hoursWeekday}
					<p class="text-base">{hoursWeekday}</p>
				{/if}
				{#if hoursSaturday}
					<p class="text-base">{hoursSaturday}</p>
				{/if}
				{#if address}
					<p class="text-muted-foreground text-sm">{address}</p>
				{/if}
			</div>

			{#if mapbox}
				<div
					class="tile-frame h-64 w-full overflow-hidden lg:col-span-2 lg:row-span-2 lg:h-full"
					role="img"
					aria-label={m.contacts_map_title()}
				>
					<MapboxMap
						token={mapbox.token}
						styleUrl={mapbox.styleUrl}
						lng={mapbox.lng}
						lat={mapbox.lat}
						zoom={mapbox.zoom}
					/>
				</div>
			{:else}
				<div
					class="tile-frame bg-muted text-muted-foreground flex h-64 items-center justify-center p-6 text-center lg:col-span-2 lg:row-span-2 lg:h-full"
				>
					{m.contacts_map_unavailable()}
				</div>
			{/if}

			<div
				class="tile-frame relative h-40 overflow-hidden bg-[color:var(--color-photo-placeholder)] lg:h-full"
			>
				<Image id={clinicPhotoId} alt={clinicPhotoAlt ?? ''} width={400} height={256} />
			</div>

			{#if ratingValue}
				<div class="tile-frame bg-primary flex flex-col justify-center gap-2 p-6 text-white">
					<span class="font-heading text-4xl">{ratingValue}</span>
					{#if ratingLabel}
						<span class="text-sm">{ratingLabel}</span>
					{/if}
					{#if reviewsUrl}
						<!-- reviewsUrl is always an external absolute URL (2gis.kz); resolve() only accepts internal paths and would throw here. -->
						<a
							href={reviewsUrl}
							target="_blank"
							rel="noopener noreferrer"
							class="hover-zoom text-sm underline"
						>
							{m.contacts_reviews_link()}
						</a>
					{/if}
				</div>
			{/if}
		</div>
	</Reveal>
</section>
