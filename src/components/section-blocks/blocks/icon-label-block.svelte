<script lang="ts">
	import type { IconLabelBlockData } from '$lib/types/content';
	import Icon from '@iconify/svelte';

	let { data }: { data: IconLabelBlockData } = $props();
</script>

<div class="tile-frame bg-secondary flex items-center gap-3 p-4">
	{#if data.icon}
		<Icon icon={data.icon} width="24" height="24" />
	{/if}
	<p class="font-medium">{data.label}</p>
</div>
