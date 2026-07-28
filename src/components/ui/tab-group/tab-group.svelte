<script lang="ts">
	import { cn } from '$lib/utils.js';

	type Option = { value: string; label: string };

	let {
		options,
		value = $bindable(options[0]?.value),
		class: className,
		...restProps
	}: { options: Option[]; value?: string; class?: string } & Record<string, unknown> = $props();
</script>

<div data-slot="tab-group" role="tablist" class={cn('inline-flex gap-1.5', className)} {...restProps}>
	{#each options as option (option.value)}
		<button
			type="button"
			role="tab"
			aria-selected={value === option.value}
			onclick={() => (value = option.value)}
			class={cn(
				'h-12 px-4 text-sm transition-colors',
				value === option.value
					? 'bg-primary text-primary-foreground'
					: 'bg-secondary text-secondary-foreground hover:bg-secondary/70'
			)}
		>
			{option.label}
		</button>
	{/each}
</div>
