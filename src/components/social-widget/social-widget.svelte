<script lang="ts">
	import type { Attachment } from 'svelte/attachments';
	import { fly, fade } from 'svelte/transition';
	import Icon from '@iconify/svelte';
	import XIcon from '@lucide/svelte/icons/x';
	import { onClickOutside } from 'runed';
	import { buildAssetUrl } from '$lib/directus/assets.js';
	import { cn } from '$lib/utils.js';
	import * as m from '$lib/paraglide/messages.js';
	import type { SocialLink } from '$lib/types/content';

	let { links }: { links: SocialLink[] } = $props();

	let open = $state(false);
	let container: HTMLElement | undefined;

	const primary = $derived(links[0] as SocialLink | undefined);

	onClickOutside(
		() => container,
		() => {
			open = false;
		}
	);

	const trackContainer: Attachment = (node) => {
		container = node as HTMLElement;
	};

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape') open = false;
	}

	function backgroundStyle(link: SocialLink | undefined): string | undefined {
		if (!link) return undefined;
		return `background: ${link.color ?? 'var(--color-brand-primary)'}`;
	}
</script>

<svelte:window onkeydown={open ? handleKeydown : undefined} />

{#if links.length > 0}
	<div
		{@attach trackContainer}
		class="fixed right-4 bottom-4 z-50 flex flex-col-reverse items-center gap-3 sm:right-6 sm:bottom-6"
		data-slot="social-widget"
	>
		<button
			type="button"
			aria-expanded={open}
			aria-label={open ? m.social_menu_close() : m.social_menu_open()}
			onclick={() => (open = !open)}
			class="relative flex size-14 items-center justify-center rounded-full shadow-lg transition-transform hover:scale-105 sm:size-16"
		>
			{#if !open}
				<span class="pulse-ring" style={backgroundStyle(primary)}></span>
				<span class="pulse-ring pulse-ring-delay" style={backgroundStyle(primary)}></span>
			{/if}
			<span
				class={cn(
					'relative z-10 flex size-full items-center justify-center rounded-full',
					open ? 'bg-white' : 'text-white'
				)}
				style={open ? undefined : backgroundStyle(primary)}
			>
				{#if open}
					<XIcon class="size-6 text-destructive" />
				{:else if primary?.imageId}
					<img
						src={buildAssetUrl(primary.imageId, { width: 64, height: 64, fit: 'cover' })}
						alt=""
						class="size-7 rounded-full object-cover"
					/>
				{:else if primary?.iconName}
					<Icon icon={primary.iconName} width="28" height="28" />
				{/if}
			</span>
		</button>

		{#if open}
			{#each links as link, i (link.id)}
				<!-- link.url is always an external absolute URL (wa.me, instagram.com, ...); resolve() only accepts internal paths and would throw here. -->
				<a
					href={link.url}
					target="_blank"
					rel="noopener noreferrer"
					aria-label={link.label}
					class="hover-zoom flex size-12 items-center justify-center rounded-full text-white shadow-lg"
					style={backgroundStyle(link)}
					in:fly={{ y: 12, duration: 200, delay: i * 60 }}
					out:fade={{ duration: 120 }}
				>
					{#if link.imageId}
						<img
							src={buildAssetUrl(link.imageId, { width: 56, height: 56, fit: 'cover' })}
							alt=""
							class="size-6 rounded-full object-cover"
						/>
					{:else if link.iconName}
						<Icon icon={link.iconName} width="24" height="24" />
					{/if}
				</a>
			{/each}
		{/if}
	</div>
{/if}

<style>
	@keyframes pulse-ring {
		0% {
			transform: scale(1);
			opacity: 0.55;
		}
		100% {
			transform: scale(1.8);
			opacity: 0;
		}
	}

	.pulse-ring {
		position: absolute;
		inset: 0;
		border-radius: 9999px;
		animation: pulse-ring 2s cubic-bezier(0.2, 0.6, 0.4, 1) infinite;
	}

	.pulse-ring-delay {
		animation-delay: 1s;
	}

	@media (prefers-reduced-motion: reduce) {
		.pulse-ring {
			animation: none;
			display: none;
		}
	}
</style>
