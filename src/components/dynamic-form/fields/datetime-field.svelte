<script lang="ts">
	import ULabel from '$components/ui/label/label.svelte';
	import UInput from '$components/ui/input/input.svelte';
	import type { FormFieldSchema } from '$lib/types/content';

	let {
		schema,
		value = $bindable('')
	}: {
		schema: FormFieldSchema;
		value?: string;
	} = $props();
</script>

<div class="flex flex-col gap-2">
	<ULabel for={`field-${schema.field}`} class="text-[15px] font-normal text-white">{schema.label}</ULabel>
	<UInput id={`field-${schema.field}`} type="datetime-local" bind:value />
</div>
