<script lang="ts">
	import { untrack } from 'svelte';
	import { fade } from 'svelte/transition';
	import { createQuery, type QueryClient } from '@tanstack/svelte-query';
	import XIcon from '@lucide/svelte/icons/x';
	import InfoIcon from '@lucide/svelte/icons/info';
	import UButton from '$components/ui/button/button.svelte';
	import * as Alert from '$components/ui/alert/index.js';
	import HcaptchaWidget from './hcaptcha-widget.svelte';
	import { fieldRegistry, defaultField } from './field-registry.js';
	import { formSchemaQueryOptions } from '$lib/queries/forms';
	import { whatsappHref } from '$lib/utils.js';
	import type { FormCollection } from '$lib/types/content';

	let {
		collection,
		title,
		phone,
		note,
		queryClient,
		onClose,
		class: className
	}: {
		collection: FormCollection;
		title: string;
		phone: string;
		note?: string;
		queryClient: QueryClient;
		onClose?: () => void;
		class?: string;
	} = $props();

	const schemaQuery = createQuery(() => formSchemaQueryOptions(collection), () => queryClient);

	let formData = $state<Record<string, string>>({});
	let captchaToken = $state<string | undefined>(undefined);
	let submitting = $state(false);
	let submitError = $state<string | undefined>(undefined);
	let submitted = $state(false);

	// Seed a key for every field before the template ever binds to it — bind:value can't
	// accept `undefined` when the target has a bindable fallback (Svelte 5 props_invalid_value).
	// $effect.pre runs before the DOM/template reacts to schemaQuery.data changing, so the keys
	// are guaranteed to exist by the time the {#each} block below reads them. The read+write of
	// formData is wrapped in untrack — otherwise the effect would depend on formData too, and
	// its own write would immediately re-trigger itself (effect_update_depth_exceeded).
	$effect.pre(() => {
		const fields = schemaQuery.data;
		if (!fields) return;
		untrack(() => {
			const seeded: Record<string, string> = {};
			for (const field of fields) {
				seeded[field.field] = formData[field.field] ?? '';
			}
			formData = seeded;
		});
	});

	async function handleSubmit(event: SubmitEvent) {
		event.preventDefault();
		submitting = true;
		submitError = undefined;

		try {
			const response = await fetch(`/api/forms/submit/${collection}`, {
				method: 'POST',
				headers: { 'content-type': 'application/json' },
				body: JSON.stringify({ ...formData, captchaToken })
			});
			if (!response.ok) {
				const body = await response.json().catch(() => ({ message: 'Не удалось отправить заявку' }));
				submitError = body.message ?? 'Не удалось отправить заявку';
				return;
			}
			submitted = true;
		} catch {
			submitError = 'Не удалось отправить заявку — проверьте соединение';
		} finally {
			submitting = false;
		}
	}
</script>

<div data-slot="dynamic-form" class={className}>
	<div class="flex items-start justify-between">
		<h2 class="mb-5 font-heading text-[26px] text-white">{title}</h2>
		{#if onClose}
			<button
				type="button"
				aria-label="Закрыть"
				onclick={onClose}
				class="hover-zoom flex size-10 items-center justify-center bg-[#F2EEF0] text-foreground"
			>
				<XIcon class="size-4" />
			</button>
		{/if}
	</div>

	{#if submitted}
		<div class="flex flex-col gap-4 py-6">
			<p class="text-white">Заявка отправлена — мы свяжемся с вами в ближайшее время.</p>
			<UButton href={whatsappHref(phone)} target="_blank" rel="noopener noreferrer" size="lg" class="w-full">
				Написать в WhatsApp
			</UButton>
		</div>
	{:else if schemaQuery.data}
		<form class="flex flex-col gap-6" onsubmit={handleSubmit} in:fade={{ duration: 150 }}>
			<div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
				{#each schemaQuery.data as field (field.field)}
					{@const FieldComponent = fieldRegistry[field.interface] ?? defaultField}
					<div class={field.width === 'full' ? 'sm:col-span-2' : ''}>
						<FieldComponent schema={field} bind:value={formData[field.field]} />
					</div>
				{/each}
			</div>

			{#if note}
				<Alert.Root variant="warning">
					<InfoIcon />
					<Alert.Description>{note}</Alert.Description>
				</Alert.Root>
			{/if}

			<HcaptchaWidget bind:token={captchaToken} />

			{#if submitError}
				<p class="text-destructive text-sm">{submitError}</p>
			{/if}

			<UButton type="submit" size="lg" class="w-full" disabled={submitting}>
				{submitting ? 'Отправляем…' : 'Отправить заявку'}
			</UButton>
		</form>
	{/if}
</div>
