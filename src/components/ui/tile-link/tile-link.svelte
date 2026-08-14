<script lang="ts">
	import type { Snippet } from 'svelte';
	import { resolve } from '$app/paths';
	import type { Pathname } from '$app/types';

	let {
		href,
		class: className,
		onmouseenter,
		children
	}: {
		href?: string;
		class?: string;
		onmouseenter?: (event: MouseEvent) => void;
		children: Snippet;
	} = $props();

	const isExternal = $derived(href ? /^https?:\/\//.test(href) : false);
	const isHash = $derived(href ? href.startsWith('#') : false);
</script>

{#if href}
	{#if isExternal}
		<!-- external absolute URL; resolve() only accepts internal paths and would throw here. -->
		<a {href} class={className} target="_blank" rel="noopener noreferrer" {onmouseenter}>{@render children()}</a>
	{:else if isHash}
		<!-- fragment on the current page (e.g. #apply); resolve() has no route id for this. -->
		<a {href} class={className} {onmouseenter}>{@render children()}</a>
	{:else}
		<a href={resolve(href as Pathname)} class={className} {onmouseenter}>{@render children()}</a>
	{/if}
{:else}
	<!-- onmouseenter here is a decorative hover-preview affordance, not an essential control; content stays fully readable without it -->
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div class={className} {onmouseenter}>{@render children()}</div>
{/if}
