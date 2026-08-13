<script lang="ts">
	import ULabel from '$components/ui/label/label.svelte';
	import UTextarea from '$components/ui/textarea/textarea.svelte';
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
	<ULabel for={`field-${schema.field}`} class="text-[15px] font-normal text-foreground">{schema.label}</ULabel>
	<UTextarea id={`field-${schema.field}`} bind:value placeholder={schema.placeholder} />
</div>
