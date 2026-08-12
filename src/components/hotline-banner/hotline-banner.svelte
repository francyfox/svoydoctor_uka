<script lang="ts">
	import { Marquee } from '$components/ui/marquee/index.js';

	let { text }: { text: string } = $props();
</script>

<div
	data-slot="hotline-banner"
	class="relative z-40 border-b border-[color:var(--color-warning)]/30 bg-[color:var(--color-warning-bg)] px-4 py-1 text-lg text-[color:var(--color-warning-fg)]"
>
	<Marquee {text} class="container" />
</div>
