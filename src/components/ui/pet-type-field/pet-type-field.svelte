<script lang="ts">
	import Label from '$components/ui/label/label.svelte';
	import Input from '$components/ui/input/input.svelte';
	import Cat from '@lucide/svelte/icons/cat';
	import Dog from '@lucide/svelte/icons/dog';
	import { cn } from '$lib/utils.js';

	let {
		value = $bindable<'cat' | 'dog' | 'other'>('cat'),
		otherValue = $bindable(''),
		class: className
	}: { value?: 'cat' | 'dog' | 'other'; otherValue?: string; class?: string } = $props();

	const chipClass = (active: boolean) =>
		cn(
			'inline-flex h-12 items-center gap-2 px-4 text-[15px] transition-colors',
			active
				? 'bg-primary text-primary-foreground'
				: 'bg-secondary text-secondary-foreground hover:bg-secondary/70'
		);
</script>

<div data-slot="pet-type-field" class={cn('flex flex-col gap-2', className)}>
	<Label class="text-[15px] font-normal text-foreground">Вид животного</Label>
	<div class="flex flex-wrap gap-2">
		<button type="button" class={chipClass(value === 'cat')} onclick={() => (value = 'cat')}>
			<Cat class="size-4" />
			Кошка
		</button>
		<button type="button" class={chipClass(value === 'dog')} onclick={() => (value = 'dog')}>
			<Dog class="size-4" />
			Собака
		</button>
		<button type="button" class={chipClass(value === 'other')} onclick={() => (value = 'other')}>
			Другое
		</button>
	</div>
	{#if value === 'other'}
		<Input bind:value={otherValue} placeholder="Укажите вид животного…" />
	{/if}
</div>
