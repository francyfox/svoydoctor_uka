<script lang="ts">
	import { iconRegistry, type IconName } from './icon.data.js';

	let {
		name,
		class: className
	}: {
		name: IconName;
		class?: string;
	} = $props();

	const IconComponent = $derived(iconRegistry[name]);
</script>

<IconComponent class={className} />
