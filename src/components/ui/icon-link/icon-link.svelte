<script lang="ts">
	import { Icon, type IconName } from '$components/ui/icon/index.js';
	import { cn } from '$lib/utils.js';

	let {
		icon,
		href,
		label,
		class: className,
		iconClass = 'size-7'
	}: {
		icon: IconName;
		href: string;
		label: string;
		class?: string;
		iconClass?: string;
	} = $props();
</script>

<!-- href is always an external absolute URL (wa.me, instagram.com, ...); resolve() only accepts internal paths and would throw here. -->
<a
	{href}
	target="_blank"
	rel="noopener noreferrer"
	aria-label={label}
	class={cn('flex items-center justify-center text-white', className)}
>
	<Icon name={icon} class={iconClass} />
</a>
