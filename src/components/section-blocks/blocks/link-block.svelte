<script lang="ts">
	import type { LinkBlockData } from '$lib/types/content';
	import { TileLink } from '$components/ui/tile-link/index.js';

	let { data }: { data: LinkBlockData } = $props();
</script>

<TileLink href={data.href} class="tile-frame hover-zoom bg-secondary flex items-center p-4">
	<span class="font-medium">{data.label}</span>
</TileLink>
