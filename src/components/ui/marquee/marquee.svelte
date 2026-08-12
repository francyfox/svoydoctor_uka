<script lang="ts">
	import { cn } from '$lib/utils.js';
	import type { Attachment } from 'svelte/attachments';

	let {
		text,
		class: className
	}: {
		text: string;
		class?: string;
	} = $props();

	let overflowing = $state(false);

	const measure: Attachment<HTMLDivElement> = (node) => {
		text;

		const check = () => {
			overflowing = node.scrollWidth > node.clientWidth + 1;
		};
		check();

		const observer = new ResizeObserver(check);
		observer.observe(node);
		return () => observer.disconnect();
	};
</script>

<div data-slot="marquee" class={cn('overflow-hidden whitespace-nowrap', className)} {@attach measure}>
	{#if overflowing}
		<div class="marquee-track">
			<span class="marquee-item">{text}</span>
			<span class="marquee-item" aria-hidden="true">{text}</span>
		</div>
	{:else}
		<span class="block text-center">{text}</span>
	{/if}
</div>
