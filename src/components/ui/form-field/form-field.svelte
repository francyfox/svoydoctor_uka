<script lang="ts">
	import ULabel from '$components/ui/label/label.svelte';
	import UInput from '$components/ui/input/input.svelte';
	import { cn } from '$lib/utils.js';

	let {
		label,
		id,
		value = $bindable(''),
		type = 'text',
		placeholder,
		class: className
	}: {
		label: string;
		id: string;
		value?: string;
		type?: 'text' | 'tel' | 'email';
		placeholder?: string;
		class?: string;
	} = $props();
</script>

<div data-slot="form-field" class={cn('flex flex-col gap-2', className)}>
	<ULabel for={id} class="text-[15px] font-normal text-foreground">{label}</ULabel>
	<UInput {id} bind:value {type} {placeholder} />
</div>
