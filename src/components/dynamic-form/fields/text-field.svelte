<script lang="ts">
	import FormField from '$components/ui/form-field/form-field.svelte';
	import type { FormFieldSchema } from '$lib/types/content';

	let {
		schema,
		value = $bindable('')
	}: {
		schema: FormFieldSchema;
		value?: string;
	} = $props();

	const type = $derived(schema.field === 'phone' ? 'tel' : 'text');
</script>

<FormField label={schema.label} id={`field-${schema.field}`} bind:value {type} placeholder={schema.placeholder} />
