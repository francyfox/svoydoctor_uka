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

	const isExternal = $derived(href ? /^https?:\/\//.test(href) : false);
</script>

{#if href}
	{#if isExternal}
		<a {href} class={className} target="_blank" rel="noopener noreferrer">{@render children()}</a>
	{:else}
		<a href={resolve(href as Pathname)} class={className}>{@render children()}</a>
	{/if}
{:else}
	<div class={className}>{@render children()}</div>
{/if}
