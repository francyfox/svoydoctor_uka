<script lang="ts" generics="T">
	import { Splide, SplideSlide } from '@splidejs/svelte-splide';
	import '@splidejs/svelte-splide/css/splide-core.min.css';
	import type { Options, Splide as SplideInstance } from '@splidejs/splide';
	import type { MoveEventDetail } from '@splidejs/svelte-splide/types';
	import UButton from '$components/ui/button/button.svelte';
	import PaginationDot from '$components/ui/pagination-dot/pagination-dot.svelte';
	import ChevronUp from '@lucide/svelte/icons/chevron-up';
	import ChevronDown from '@lucide/svelte/icons/chevron-down';
	import { cn } from '$lib/utils.js';

	let {
		items,
		card,
		autoplay = true,
		speed = 600,
		interval = 3500,
		class: className
	}: {
		items: T[];
		card: import('svelte').Snippet<[T, number]>;
		autoplay?: boolean;
		speed?: number;
		interval?: number;
		class?: string;
	} = $props();

	let splideInstance: SplideInstance | undefined = $state();
	let index = $state(0);

	const options: Options = $derived({
		type: 'loop',
		direction: 'ttb',
		height: '100%',
		autoHeight: false,
		gap: '0.5rem',
		pagination: false,
		arrows: false,
		autoplay,
		perPage: 1,
		speed,
		interval,
		drag: 'free',
		snap: true
	});
</script>

<div data-slot="vertical-slider" class={cn('flex h-full flex-col gap-3', className)}>
	<div class="min-h-0 flex-1">
		<Splide
			bind:splide={splideInstance}
			{options}
			on:moved={(e?: CustomEvent<MoveEventDetail>) => {
				if (e) index = e.detail.index;
			}}
		>
			{#each items as item, i (i)}
				<SplideSlide>
					{@render card(item, i)}
				</SplideSlide>
			{/each}
		</Splide>
	</div>
	<div class="flex items-center justify-center gap-3">
		<UButton variant="dark" size="icon" onclick={() => splideInstance?.go('<')} aria-label="Предыдущий">
			<ChevronUp />
		</UButton>
		<div class="flex items-center gap-2">
			{#each items as _, i (i)}
				<PaginationDot active={i === index} />
			{/each}
		</div>
		<UButton variant="dark" size="icon" onclick={() => splideInstance?.go('>')} aria-label="Следующий">
			<ChevronDown />
		</UButton>
	</div>
</div>
