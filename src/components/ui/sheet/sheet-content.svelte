<script lang="ts" module>
	export type Side = "top" | "right" | "bottom" | "left";
</script>

<script lang="ts">
	import { Dialog as SheetPrimitive } from "bits-ui";
	import { fly } from "svelte/transition";
	import type { Snippet } from "svelte";
	import SheetPortal from "./sheet-portal.svelte";
	import SheetOverlay from "./sheet-overlay.svelte";
	import { UButton } from "$components/ui/button/index.js";
	import XIcon from '@lucide/svelte/icons/x';
	import { cn, type WithoutChildrenOrChild } from "$lib/utils.js";
	import type { ComponentProps } from "svelte";

	let {
		ref = $bindable(null),
		class: className,
		side = "right",
		showCloseButton = true,
		portalProps,
		children,
		...restProps
	}: WithoutChildrenOrChild<SheetPrimitive.ContentProps> & {
		portalProps?: WithoutChildrenOrChild<ComponentProps<typeof SheetPortal>>;
		side?: Side;
		showCloseButton?: boolean;
		children: Snippet;
	} = $props();

	const flyParams = $derived(
		side === 'left'
			? { x: '-100%' }
			: side === 'top'
				? { y: '-100%' }
				: side === 'bottom'
					? { y: '100%' }
					: { x: '100%' }
	);
</script>

<SheetPortal {...portalProps}>
	<SheetOverlay />
	<SheetPrimitive.Content
		bind:ref
		data-slot="sheet-content"
		data-side={side}
		forceMount
		{...restProps}
	>
		{#snippet child({ props, open })}
			{#if open}
				<div
					{...props}
					class={cn(
						"bg-popover text-popover-foreground fixed z-50 flex flex-col gap-4 bg-clip-padding text-sm shadow-lg data-[side=bottom]:inset-x-0 data-[side=bottom]:bottom-0 data-[side=bottom]:h-auto data-[side=bottom]:border-t data-[side=left]:inset-y-0 data-[side=left]:left-0 data-[side=left]:h-full data-[side=left]:w-3/4 data-[side=left]:border-r data-[side=right]:inset-y-0 data-[side=right]:right-0 data-[side=right]:h-full data-[side=right]:w-3/4 data-[side=right]:border-l data-[side=top]:inset-x-0 data-[side=top]:top-0 data-[side=top]:h-auto data-[side=top]:border-b data-[side=left]:sm:max-w-sm data-[side=right]:sm:max-w-sm",
						className
					)}
					transition:fly={{ ...flyParams, duration: 200 }}
				>
					{@render children?.()}
					{#if showCloseButton}
						<SheetPrimitive.Close data-slot="sheet-close">
							{#snippet child({ props })}
								<UButton variant="ghost" class="absolute top-3 right-3" size="icon-sm" {...props}>
									<XIcon />
									<span class="sr-only">Close</span>
								</UButton>
							{/snippet}
						</SheetPrimitive.Close>
					{/if}
				</div>
			{/if}
		{/snippet}
	</SheetPrimitive.Content>
</SheetPortal>
