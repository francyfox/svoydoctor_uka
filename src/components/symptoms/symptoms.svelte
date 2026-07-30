<script lang="ts">
	import { cn } from '$lib/utils.js';
	import type { SymptomItem } from '$lib/types/content';
	import * as m from '$lib/paraglide/messages.js';
	import { TabGroup } from '$components/ui/tab-group/index.js';
	import { Slider } from '$components/ui/slider/index.js';

	let {
		title,
		subtitle,
		symptoms,
		editToken,
		class: className
	}: {
		title: string;
		subtitle?: string;
		symptoms: SymptomItem[];
		editToken?: string;
		class?: string;
	} = $props();

	let species = $state('cat');

	const tabOptions = $derived([
		{ value: 'cat', label: m.symptoms_tab_cat() },
		{ value: 'dog', label: m.symptoms_tab_dog() }
	]);

	const filtered = $derived(
		symptoms.filter((symptom) => symptom.species === species || symptom.species === 'both')
	);
</script>

<section
	id="symptoms"
	data-slot="symptoms"
	class={cn('bg-secondary py-10 lg:py-16', className)}
	data-squidex-token={editToken}
>
	<div class="container flex flex-col gap-6">
		<div class="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
			<div>
				<h2 class="font-heading text-3xl lg:text-[length:var(--font-tile-h2)]">{title}</h2>
				{#if subtitle}
					<p class="text-muted-foreground mt-2 text-lg">{subtitle}</p>
				{/if}
			</div>
			<TabGroup options={tabOptions} bind:value={species} />
		</div>

		{#if filtered.length > 0}
			{#key species}
				<Slider items={filtered}>
					{#snippet card(symptom: SymptomItem)}
						<div class="tile-frame flex h-32 w-56 items-center bg-primary p-5 sm:w-64">
							<p class="font-heading text-lg leading-tight text-white sm:text-xl">
								{symptom.text}
							</p>
						</div>
					{/snippet}
				</Slider>
			{/key}
		{/if}
	</div>
</section>
