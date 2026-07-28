<script lang="ts">
	import { cn } from '$lib/utils.js';

	type Item = { id: string; label: string; content: import('svelte').Snippet };

	let {
		items,
		openId = $bindable(items[0]?.id),
		class: className
	}: { items: Item[]; openId?: string; class?: string } = $props();
</script>

<div data-slot="accordion-strip" class={cn('flex h-[200px]', className)}>
	{#each items as item (item.id)}
		{@const isOpen = openId === item.id}
		<div class={cn('flex h-full', isOpen ? 'flex-1' : '')}>
			<button
				type="button"
				aria-expanded={isOpen}
				onclick={() => (openId = item.id)}
				class="flex w-[60px] shrink-0 items-center justify-center bg-primary font-heading text-base text-primary-foreground"
			>
				<span class="[writing-mode:vertical-rl]">{item.label}</span>
			</button>
			{#if isOpen}
				<div class="min-w-0 flex-1 bg-[var(--color-illustration-bg)] p-4 text-[13px] text-[#8A7A5C]">
					{@render item.content()}
				</div>
			{/if}
		</div>
	{/each}
</div>
