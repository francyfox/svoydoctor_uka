<script lang="ts">
	import { cn } from '$lib/utils.js';
	import type { SectionBlocks } from '$lib/types/content';
	import { Reveal } from '$components/ui/reveal/index.js';
	import { ShaderBackground } from '$components/ui/shader-background/index.js';
	import { resolveShaderScene } from '$lib/webgl/shaders/index.js';
	import { blockRegistry } from './block-registry.js';

	let {
		title,
		description,
		items,
		heading = 'h2',
		shader,
		directusAttr,
		class: className
	}: {
		title?: string;
		description?: string;
		items: SectionBlocks['items'];
		heading?: 'h1' | 'h2';
		shader?: string;
		directusAttr?: string;
		class?: string;
	} = $props();

	const fragment = $derived(resolveShaderScene(shader, 'flow'));
</script>

<section
	data-slot="section-blocks"
	class={cn('relative overflow-hidden py-16 lg:py-24', className)}
	data-directus={directusAttr}
>
	<ShaderBackground class="absolute inset-0" {fragment} />

	<Reveal class="container relative flex flex-col gap-6">
		{#if title || description}
			<div class="flex flex-col gap-4">
				{#if title}
					<svelte:element this={heading} class="font-heading text-4xl lg:text-[length:var(--font-tile-h1)]">
						{title}
					</svelte:element>
				{/if}
				{#if description}
					<p class="text-muted-foreground max-w-2xl text-lg">{description}</p>
				{/if}
			</div>
		{/if}

		{#if items.length > 0}
			<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
				{#each items as block (block.data.id)}
					{@const BlockComponent = blockRegistry[block.collection]}
					<BlockComponent data={block.data} />
				{/each}
			</div>
		{/if}
	</Reveal>
</section>
