<script lang="ts">
	import { cn } from '$lib/utils.js';
	import * as Tabs from '$components/ui/tabs/index.js';
	import IconifyIcon from '@iconify/svelte';

	type Option = { value: string; label: string; iconName?: string };

	let {
		options,
		value = $bindable(options[0]?.value),
		class: className,
		...restProps
	}: { options: Option[]; value?: string; class?: string } & Record<string, unknown> = $props();
</script>

<Tabs.Root
	bind:value
	data-slot="tab-group"
	class={cn('flex justify-center items-center gap-1.5 nyancat', className)}
	{...restProps}
>
	<Tabs.List class="inline-flex justify-center gap-1.5 rounded-none bg-transparent p-0">
		{#each options as option (option.value)}
			<Tabs.Trigger
				value={option.value}
				class={cn(
					'flex h-12 flex-none items-center gap-2 rounded-md border-none px-4 text-3xl font-heading shadow-none transition-colors',
					'data-[state=active]:bg-primary data-[state=active]:text-primary-foreground',
					'data-[state=inactive]:bg-secondary data-[state=inactive]:text-secondary-foreground data-[state=inactive]:hover:bg-secondary/70'
				)}
			>
				{#if option.iconName}
					<IconifyIcon icon={option.iconName} width="32" height="32" class="size-8" />
				{/if}
				{option.label}
			</Tabs.Trigger>
		{/each}
	</Tabs.List>
</Tabs.Root>
