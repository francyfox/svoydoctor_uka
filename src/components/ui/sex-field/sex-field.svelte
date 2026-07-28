<script lang="ts">
	import Label from '$components/ui/label/label.svelte';
	import { cn } from '$lib/utils.js';

	let {
		value = $bindable<'male' | 'female'>('male'),
		class: className
	}: { value?: 'male' | 'female'; class?: string } = $props();

	const chipClass = (active: boolean) =>
		cn(
			'inline-flex h-12 items-center px-4 text-[15px] transition-colors',
			active
				? 'bg-primary text-primary-foreground'
				: 'bg-secondary text-secondary-foreground hover:bg-secondary/70'
		);
</script>

<div data-slot="sex-field" class={cn('flex flex-col gap-2', className)}>
	<Label class="text-[15px] font-normal text-foreground">
		Пол (для стерилизации/кастрации — влияет на стоимость)
	</Label>
	<div class="flex gap-2">
		<button type="button" class={chipClass(value === 'male')} onclick={() => (value = 'male')}>
			Самец
		</button>
		<button type="button" class={chipClass(value === 'female')} onclick={() => (value = 'female')}>
			Самка
		</button>
	</div>
</div>
