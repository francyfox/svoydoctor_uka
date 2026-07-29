<script lang="ts">
	import type { Snippet } from 'svelte';
	import { resolve } from '$app/paths';
	import type { Pathname } from '$app/types';

	let {
		href,
		class: className,
		children
	}: {
		href?: string;
		class?: string;
		children: Snippet;
	} = $props();
</script>

{#if href}
	<a href={resolve(href as Pathname)} class={className}>{@render children()}</a>
{:else}
	<div class={className}>{@render children()}</div>
{/if}
