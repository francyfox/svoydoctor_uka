<script lang="ts">
	import { cn, type WithElementRef, type WithoutChildren } from "$lib/utils.js";
	import type { HTMLTextareaAttributes } from "svelte/elements";

	let {
		ref = $bindable(null),
		value = $bindable(),
		class: className,
		"data-slot": dataSlot = "textarea",
		...restProps
	}: WithoutChildren<WithElementRef<HTMLTextareaAttributes>> = $props();
</script>

<textarea
	bind:this={ref}
	data-slot={dataSlot}
	class={cn(
		"border-input focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 aria-invalid:border-destructive disabled:bg-input/50 rounded-lg border bg-background px-4 py-3 text-[15px] text-foreground transition-colors focus-visible:ring-3 aria-invalid:ring-3 placeholder:text-[#9A9296] flex field-sizing-content min-h-[120px] w-full outline-none disabled:cursor-not-allowed disabled:opacity-50",
		className
	)}
	bind:value
	{...restProps}
></textarea>
