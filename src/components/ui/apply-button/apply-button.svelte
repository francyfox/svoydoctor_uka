<script lang="ts">
	import type { Snippet } from 'svelte';
	import { cn } from '$lib/utils.js';

	let {
		href,
		class: className,
		onclick,
		children
	}: {
		href: string;
		class?: string;
		onclick?: () => void;
		children: Snippet;
	} = $props();
</script>

<a
	{href}
	{onclick}
	class={cn(
		'hover-zoom font-heading inline-flex items-center justify-center bg-primary text-white hover:bg-primary/90',
		className
	)}
>
	{@render children()}
</a>
