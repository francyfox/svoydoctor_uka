<script lang="ts">
	import { cn } from '$lib/utils.js';

	let {
		active = false,
		class: className,
		...restProps
	}: { active?: boolean; class?: string } & Record<string, unknown> = $props();
</script>

<span
	data-slot="pagination-dot"
	data-active={active}
	class={cn(
		'inline-block shrink-0 rounded-full transition-all duration-300',
		active ? 'bg-primary size-2.5 lg:size-4' : 'size-1.5 lg:size-3.5 bg-[#D9C9D3]',
		className
	)}
	{...restProps}
></span>
