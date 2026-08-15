<script lang="ts">
	import ULabel from '$components/ui/label/label.svelte';
	import * as Select from '$components/ui/select/index.js';
	import type { FormFieldSchema } from '$lib/types/content';

	let {
		schema,
		value = $bindable('')
	}: {
		schema: FormFieldSchema;
		value?: string;
	} = $props();

	const selectedLabel = $derived(schema.choices?.find((choice) => choice.value === value)?.text);
</script>

<div class="flex flex-col gap-2">
	<ULabel class="text-[15px] font-normal text-white">{schema.label}</ULabel>
	<Select.Root type="single" bind:value>
		<Select.Trigger
			class="h-[52px] w-full border border-white/15 bg-white/5 px-4 text-[15px] text-white data-placeholder:text-white/40 [&>svg]:text-white/60"
		>
			{selectedLabel ?? schema.placeholder ?? 'Выберите...'}
		</Select.Trigger>
		<Select.Content class="bg-[color:var(--color-brand-ink)] text-white ring-white/10">
			{#each schema.choices ?? [] as choice (choice.value)}
				<Select.Item value={choice.value} label={choice.text}>{choice.text}</Select.Item>
			{/each}
		</Select.Content>
	</Select.Root>
</div>
