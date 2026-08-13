<script lang="ts">
	import ULabel from '$components/ui/label/label.svelte';
	import Icon from '@iconify/svelte';
	import { cn } from '$lib/utils.js';
	import type { FormFieldSchema } from '$lib/types/content';

	let {
		schema,
		value = $bindable('')
	}: {
		schema: FormFieldSchema;
		value?: string;
	} = $props();

	function chipClass(active: boolean): string {
		return cn(
			'hover-zoom inline-flex h-12 items-center gap-2 px-4 text-[15px] transition-colors',
			active
				? 'bg-primary text-primary-foreground'
				: 'bg-secondary text-secondary-foreground hover:bg-secondary/70'
		);
	}
</script>

<div data-slot="chip-group-field" class="flex flex-col gap-2">
	<ULabel class="text-[15px] font-normal text-foreground">{schema.label}</ULabel>
	<div class="flex flex-wrap gap-2">
		{#each schema.choices ?? [] as choice (choice.value)}
			<button
				type="button"
				class={chipClass(value === choice.value)}
				onclick={() => (value = choice.value)}
			>
				{#if choice.icon}
					<Icon icon={choice.icon} width="16" height="16" />
				{/if}
				{choice.text}
			</button>
		{/each}
	</div>
</div>
