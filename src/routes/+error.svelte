<script lang="ts">
	import { page } from '$app/state';
	import { resolve } from '$app/paths';
	import type { Pathname } from '$app/types';
	import { localizeHref } from '$lib/paraglide/runtime';
	import { Button } from '$components/ui/button/index.js';
	import * as m from '$lib/paraglide/messages.js';

	const isNotFound = $derived(page.status === 404);
	const title = $derived(isNotFound ? m.error_404_title() : m.error_generic_title());
	const message = $derived(
		isNotFound ? m.error_404_message() : (page.error?.message ?? m.error_generic_message())
	);
</script>

<section class="flex min-h-[60vh] items-center justify-center py-16">
	<div class="container flex flex-col items-center gap-6 text-center">
		<span class="font-heading text-primary text-7xl lg:text-8xl">{page.status}</span>
		<div class="flex flex-col gap-2">
			<h1 class="font-heading text-3xl lg:text-[length:var(--font-tile-h2)]">{title}</h1>
			<p class="text-muted-foreground text-lg">{message}</p>
		</div>
		<Button href={resolve(localizeHref('/') as Pathname)} size="lg">
			{m.error_back_home()}
		</Button>
	</div>
</section>
