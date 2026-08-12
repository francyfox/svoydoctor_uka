<script lang="ts">
	import { Dialog as SheetPrimitive } from "bits-ui";
	import { fade } from "svelte/transition";
	import { cn } from "$lib/utils.js";

	let {
		ref = $bindable(null),
		class: className,
		...restProps
	}: SheetPrimitive.OverlayProps = $props();
</script>

<SheetPrimitive.Overlay bind:ref data-slot="sheet-overlay" forceMount {...restProps}>
	{#snippet child({ props, open })}
		{#if open}
			<div
				{...props}
				class={cn(
					"bg-black/10 supports-backdrop-filter:backdrop-blur-xs fixed inset-0 z-50",
					className
				)}
				transition:fade={{ duration: 200 }}
			></div>
		{/if}
	{/snippet}
</SheetPrimitive.Overlay>
