<script lang="ts" generics="T extends { id: string; label: string }">
	import { cn } from '$lib/utils.js';

	let {
		items,
		openId = $bindable(items[0]?.id),
		content,
		mode = 'horizontal',
		class: className
	}: {
		items: T[];
		openId?: string;
		content: import('svelte').Snippet<[T]>;
		mode?: 'horizontal' | 'vertical';
		class?: string;
	} = $props();
</script>

{#if mode === 'vertical'}
	<div data-slot="accordion-strip" class={cn('flex w-full flex-col', className)}>
		{#each items as item, i (item.id)}
			{@const isOpen = openId === item.id}
			<div class="flex flex-col">
				<button
					type="button"
					aria-expanded={isOpen}
					onclick={() => (openId = item.id)}
					class={cn(
						i % 2 === 0 ? 'bg-primary' : 'bg-[var(--color-brand-accent)]',
						'flex w-full items-center px-4 py-3 font-heading text-lg uppercase text-primary-foreground tile-frame-gradient transition-[filter,opacity] duration-500 hover:brightness-110',
						isOpen ? 'opacity-100' : 'opacity-75 hover:opacity-100'
					)}
				>
					<span>{item.label}</span>
				</button>
				<div
					class={cn(
						'grid overflow-hidden transition-[grid-template-rows] duration-700 ease-in-out',
						isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
					)}
				>
					<div class={cn(
							'min-h-0 overflow-hidden accordion-strip-content text-[13px] text-slate-950 transition-[padding] duration-700 ease-in-out',
							isOpen ? 'p-4' : 'p-0'
						)}>
						{@render content(item)}
					</div>
				</div>
			</div>
		{/each}
	</div>
{:else}
	<div data-slot="accordion-strip" class={cn('flex h-[400px] md:h-[60dvh] w-full', className)}>
		{#each items as item, i (item.id)}
			{@const isOpen = openId === item.id}
			<div
				class={cn(
					'flex h-full overflow-hidden transition-[flex] duration-700 ease-in-out',
					isOpen ? 'flex-1' : 'flex-[0_0_60px]'
				)}
			>
				<button
					type="button"
					aria-expanded={isOpen}
					onclick={() => (openId = item.id)}
					class={cn(
						i % 2 === 0 ? 'bg-primary' : 'bg-[var(--color-brand-accent)]',
						'flex w-[60px] shrink-0 items-start justify-center py-5 font-heading text-primary-foreground tile-frame-gradient transition-[flex,opacity,filter] duration-500 hover:brightness-110',
						isOpen ? 'opacity-100' : 'opacity-75 hover:opacity-100'
					)}
				>
					<span class="accordion-strip-label uppercase">{item.label}</span>
				</button>
				<div
					class="min-w-0 flex-1 overflow-hidden accordion-strip-content p-4 text-[13px] text-slate-950"
				>
					{@render content(item)}
				</div>
			</div>
		{/each}
	</div>
{/if}

<style>
	[data-slot='accordion-strip'] {
		& .accordion-strip-label {
			writing-mode: vertical-lr;
			text-orientation: upright;
			font-size: var(--font-tile-vertical-label);
		}
	}

	.accordion-strip-content {
		background: radial-gradient(circle at 20% 30%, rgba(255, 255, 255, 0.9), rgba(180, 140, 200, 0.4)) !important;
	}
</style>
