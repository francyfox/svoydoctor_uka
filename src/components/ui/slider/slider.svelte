<script lang="ts" generics="T">
	import { Splide, SplideSlide } from '@splidejs/svelte-splide';
	import '@splidejs/svelte-splide/css/splide-core.min.css';
	import type { Options, Splide as SplideInstance } from '@splidejs/splide';
	import type { MoveEventDetail } from '@splidejs/svelte-splide/types';
	import Button from '$components/ui/button/button.svelte';
	import PaginationDot from '$components/ui/pagination-dot/pagination-dot.svelte';
	import ChevronLeft from '@lucide/svelte/icons/chevron-left';
	import ChevronRight from '@lucide/svelte/icons/chevron-right';
	import { cn } from '$lib/utils.js';

	let {
		items,
		card,
		class: className
	}: {
		items: T[];
		card: import('svelte').Snippet<[T, number]>;
		class?: string;
	} = $props();

	let splideInstance: SplideInstance | undefined = $state();
	let index = $state(0);

	const options: Options = {
		type: 'slide',
		autoWidth: true,
		gap: '0.5rem',
		pagination: false,
		arrows: false
	};
</script>

<div data-slot="slider" class={cn('flex flex-col gap-4', className)}>
	<div class="flex items-center gap-3">
		<Button
			variant="dark"
			size="icon"
			onclick={() => splideInstance?.go('<')}
			aria-label="Предыдущий"
		>
			<ChevronLeft />
		</Button>
		<div class="min-w-0 flex-1">
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
		<Button
			variant="dark"
			size="icon"
			onclick={() => splideInstance?.go('>')}
			aria-label="Следующий"
		>
			<ChevronRight />
		</Button>
	</div>
	<div class="flex items-center justify-center gap-2.5">
		{#each items as _, i (i)}
			<PaginationDot active={i === index} />
		{/each}
	</div>
</div>
