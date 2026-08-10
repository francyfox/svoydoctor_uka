<script lang="ts" generics="T extends { id: string; label: string }">
	import { cn } from '$lib/utils.js';

	let {
		items,
		openId = $bindable(items[0]?.id),
		content,
		class: className
	}: {
		items: T[];
		openId?: string;
		content: import('svelte').Snippet<[T]>;
		class?: string;
	} = $props();
</script>

<div data-slot="accordion-strip" class={cn('flex min-h-[70dvh]', className)}>
	{#each items as item, i (item.id)}
		{@const isOpen = openId === item.id}
		<div
			class={cn(
				'flex h-full overflow-hidden transition-[flex] duration-700 ease-in-out',
				isOpen ? 'flex-1' : ''
			)}
		>
			<button
				type="button"
				aria-expanded={isOpen}
				onclick={() => (openId = item.id)}
				class={cn(i % 2 === 0 ? "bg-primary" : "bg-[var(--color-brand-accent)]", "flex w-[60px] shrink-0 py-5 items-start justify-center font-heading text-primary-foreground tile-frame-gradient")}
			>
				<span class="accordion-strip-label uppercase">{item.label}</span>
			</button>
			{#if isOpen}
				<div class="min-w-0 flex-1 accordion-strip-content p-4 text-[13px] text-slate-950">
					{@render content(item)}
				</div>
			{/if}
		</div>
	{/each}
</div>

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
