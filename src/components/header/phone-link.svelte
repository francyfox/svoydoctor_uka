<script lang="ts">
	import { cn } from '$lib/utils.js';

	let {
		phone,
		class: className
	}: {
		phone: string;
		class?: string;
	} = $props();
</script>

<a
	href={`tel:${phone.replace(/[^+\d]/g, '')}`}
	class={cn('font-heading text-foreground whitespace-nowrap', className)}
>
	{phone}
</a>
