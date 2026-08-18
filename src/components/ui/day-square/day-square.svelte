<script lang="ts" module>
	import { cn } from '$lib/utils.js';
	import { tv, type VariantProps } from 'tailwind-variants';

	export const daySquareVariants = tv({
		base: 'inline-flex size-8 lg:size-10 shrink-0 items-center justify-center font-sans text-sm',
		variants: {
			variant: {
				default: 'bg-background border-border text-foreground border',
				today: 'bg-accent text-accent-foreground',
				off: 'bg-muted text-[#8A8388]',
				selected: 'bg-primary text-primary-foreground'
			}
		},
		defaultVariants: {
			variant: 'default'
		}
	});

	export type DaySquareVariant = VariantProps<typeof daySquareVariants>['variant'];
</script>

<script lang="ts">
	let {
		variant = 'default',
		class: className,
		children,
		...restProps
	}: {
		variant?: DaySquareVariant;
		class?: string;
		children?: import('svelte').Snippet;
	} & Record<string, unknown> = $props();
</script>

<span data-slot="day-square" class={cn(daySquareVariants({ variant }), className)} {...restProps}>
	{@render children?.()}
</span>
