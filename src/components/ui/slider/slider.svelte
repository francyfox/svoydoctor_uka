<script lang="ts" generics="T">
	import Button from '$components/ui/button/button.svelte';
	import PaginationDot from '$components/ui/pagination-dot/pagination-dot.svelte';
	import ChevronLeft from '@lucide/svelte/icons/chevron-left';
	import ChevronRight from '@lucide/svelte/icons/chevron-right';
	import { cn } from '$lib/utils.js';

	let {
		items,
		index = $bindable(0),
		card,
		class: className
	}: {
		items: T[];
		index?: number;
		card: import('svelte').Snippet<[T, number]>;
		class?: string;
	} = $props();

	function prev() {
		index = index === 0 ? items.length - 1 : index - 1;
	}
	function next() {
		index = index === items.length - 1 ? 0 : index + 1;
	}
</script>

<div data-slot="slider" class={cn('flex flex-col gap-4', className)}>
	<div class="flex items-center gap-3">
		<Button variant="dark" size="icon" onclick={prev} aria-label="Предыдущий">
			<ChevronLeft />
		</Button>
		<div class="flex flex-1 gap-2 overflow-hidden">
			{#each items as item, i (i)}
				<div class={cn('shrink-0 transition-opacity', i === index ? 'opacity-100' : 'opacity-40')}>
					{@render card(item, i)}
				</div>
			{/each}
		</div>
		<Button variant="dark" size="icon" onclick={next} aria-label="Следующий">
			<ChevronRight />
		</Button>
	</div>
	<div class="flex items-center justify-center gap-2.5">
		{#each items as _, i (i)}
			<PaginationDot active={i === index} />
		{/each}
	</div>
</div>
