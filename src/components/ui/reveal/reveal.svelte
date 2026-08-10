<script lang="ts">
	import type { Snippet } from 'svelte';
	import { IsInViewport } from 'runed';
	import { cn } from '$lib/utils.js';

	let {
		delay = 0,
		class: className,
		children
	}: {
		delay?: number;
		class?: string;
		children: Snippet;
	} = $props();

	let el = $state<HTMLElement>();
	const inViewport = new IsInViewport(() => el, { once: true, threshold: 0.15 });
</script>

<div
	bind:this={el}
	class={cn('reveal', inViewport.current && 'reveal-visible', className)}
	style={delay ? `transition-delay: ${delay}ms` : undefined}
>
	{@render children()}
</div>
