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
	const isHash = $derived(href ? href.startsWith('#') : false);
</script>

{#if href}
	{#if isExternal}
		<!-- external absolute URL; resolve() only accepts internal paths and would throw here. -->
		<a {href} class={className} target="_blank" rel="noopener noreferrer">{@render children()}</a>
	{:else if isHash}
		<!-- fragment on the current page (e.g. #apply); resolve() has no route id for this. -->
		<a {href} class={className}>{@render children()}</a>
	{:else}
		<a href={resolve(href as Pathname)} class={className}>{@render children()}</a>
	{/if}
{:else}
	<div class={className}>{@render children()}</div>
{/if}
