<script lang="ts">
	import { buildAssetUrl } from '$lib/directus/assets.js';
	import { cn } from '$lib/utils.js';
	import VideoOff from '@lucide/svelte/icons/video-off';

	let {
		id,
		class: className,
		loop = true,
		muted = true,
		autoplay = true,
		playsinline = true
	}: {
		id: string | null | undefined;
		class?: string;
		loop?: boolean;
		muted?: boolean;
		autoplay?: boolean;
		playsinline?: boolean;
	} = $props();

	let loaded = $state(false);
	let errored = $state(false);

	// SSR-rendered <video> tags can already have data before hydration runs —
	// check readyState on mount in addition to listening for future events.
	function watchLoadState(video: HTMLVideoElement) {
		if (video.readyState >= 2) {
			loaded = true;
			return;
		}

		const onLoaded = () => (loaded = true);
		const onError = () => (errored = true);
		video.addEventListener('loadeddata', onLoaded);
		video.addEventListener('error', onError);
		return () => {
			video.removeEventListener('loadeddata', onLoaded);
			video.removeEventListener('error', onError);
		};
	}
</script>

{#if id}
	<div class={cn('absolute inset-0', className)}>
		{#if !loaded && !errored}
			<div class="absolute inset-0 animate-pulse bg-[color:var(--color-photo-placeholder)]"></div>
		{/if}

		{#if errored}
			<div class="bg-muted absolute inset-0 flex items-center justify-center">
				<VideoOff class="text-muted-foreground size-6" />
			</div>
		{:else}
			<video
				src={buildAssetUrl(id)}
				{loop}
				{muted}
				{autoplay}
				{playsinline}
				disablepictureinpicture
				class={cn('size-full object-cover transition-opacity', loaded ? 'opacity-100' : 'opacity-0')}
				{@attach watchLoadState}
			></video>
		{/if}
	</div>
{:else}
	<div
		class={cn(
			'absolute inset-0 flex items-center justify-center bg-[color:var(--color-photo-placeholder)]',
			className
		)}
	>
		<VideoOff class="size-6 text-black/20" />
	</div>
{/if}
