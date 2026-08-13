<script lang="ts">
	import { cn } from '$lib/utils.js';
	import { UButton } from '$components/ui/button/index.js';
	import IconifyIcon from '@iconify/svelte';

	type Option = { value: string; label: string; iconName?: string };

	let {
		options,
		value = $bindable(options[0]?.value),
		class: className,
		...restProps
	}: { options: Option[]; value?: string; class?: string } & Record<string, unknown> = $props();
</script>

<div data-slot="tab-group" role="tablist" class={cn('inline-flex justify-center gap-1.5', className)} {...restProps}>
	{#each options as option (option.value)}
		<UButton
			variant="ghost"
			role="tab"
			aria-selected={value === option.value}
			onclick={() => (value = option.value)}
			class={cn(
				'flex h-12 items-center gap-2 px-4 text-3xl',
				value === option.value
					? 'bg-primary text-primary-foreground'
					: 'bg-secondary text-secondary-foreground hover:bg-secondary/70'
			)}
		>
			{#if option.iconName}
				<IconifyIcon icon={option.iconName} width="24" height="24" />
			{/if}
			{option.label}
		</UButton>
	{/each}
</div>
