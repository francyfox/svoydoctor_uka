<script lang="ts">
	import UButton from '$components/ui/button/button.svelte';
	import ULabel from '$components/ui/label/label.svelte';
	import FormField from '$components/ui/form-field/form-field.svelte';
	import SexField from '$components/ui/sex-field/sex-field.svelte';
	import PetTypeField from '$components/ui/pet-type-field/pet-type-field.svelte';
	import UTextarea from '$components/ui/textarea/textarea.svelte';
	import * as Alert from '$components/ui/alert/index.js';
	import * as Select from '$components/ui/select/index.js';
	import X from '@lucide/svelte/icons/x';
	import Calendar from '@lucide/svelte/icons/calendar';
	import Info from '@lucide/svelte/icons/info';
	import { cn } from '$lib/utils.js';

	let {
		services,
		service = $bindable<string | undefined>(undefined),
		name = $bindable(''),
		phone = $bindable(''),
		sex = $bindable<'male' | 'female'>('male'),
		petType = $bindable<'cat' | 'dog' | 'other'>('cat'),
		petTypeOther = $bindable(''),
		when = $bindable(''),
		reason = $bindable(''),
		prepAlert = undefined,
		onclose,
		onsubmit,
		class: className
	}: {
		services: { value: string; label: string }[];
		service?: string;
		name?: string;
		phone?: string;
		sex?: 'male' | 'female';
		petType?: 'cat' | 'dog' | 'other';
		petTypeOther?: string;
		when?: string;
		reason?: string;
		prepAlert?: string;
		onclose?: () => void;
		onsubmit?: (event: SubmitEvent) => void;
		class?: string;
	} = $props();

	const selectedLabel = $derived(services.find((s) => s.value === service)?.label);
</script>

<form
	data-slot="booking-form"
	class={cn('flex w-full max-w-[480px] flex-col gap-6 bg-secondary p-8', className)}
	{onsubmit}
>
	<div class="flex items-center justify-between">
		<h2 class="font-heading text-[26px] text-foreground">Записаться на приём</h2>
		{#if onclose}
			<button
				type="button"
				aria-label="Закрыть"
				onclick={onclose}
				class="hover-zoom flex size-10 items-center justify-center bg-[#F2EEF0] text-foreground"
			>
				<X class="size-4" />
			</button>
		{/if}
	</div>

	<div class="flex flex-col gap-2">
		<ULabel class="text-[15px] font-normal text-foreground">Услуга</ULabel>
		<Select.Root type="single" bind:value={service}>
			<Select.Trigger class="h-[52px] w-full bg-background px-4 text-[15px]">
				{selectedLabel ?? 'Выберите услугу'}
			</Select.Trigger>
			<Select.Content>
				{#each services as option (option.value)}
					<Select.Item value={option.value} label={option.label}>{option.label}</Select.Item>
				{/each}
			</Select.Content>
		</Select.Root>
	</div>

	<FormField label="Имя" id="booking-name" bind:value={name} placeholder="Как к вам обращаться?" />

	<div class="flex flex-col gap-2">
		<FormField
			label="Телефон"
			id="booking-phone"
			type="tel"
			bind:value={phone}
			placeholder="+7 ___ ___ __ __"
		/>
		<p class="text-[13px] text-muted-foreground">
			Отправляя телефон, вы соглашаетесь с <a href="/privacy" class="underline">политикой конфиденциальности</a>
		</p>
	</div>

	<SexField bind:value={sex} />

	<PetTypeField bind:value={petType} bind:otherValue={petTypeOther} />

	<div class="flex flex-col gap-2">
		<ULabel class="text-[15px] font-normal text-foreground">Когда вам удобно?</ULabel>
		<div class="flex h-[52px] items-center gap-2.5 border border-input bg-background px-4">
			<Calendar class="size-4 shrink-0 text-muted-foreground" />
			<input
				bind:value={when}
				placeholder="Например: 25 июля, после 14:00"
				class="w-full text-[15px] outline-none placeholder:text-[#9A9296]"
			/>
		</div>
	</div>

	<div class="flex flex-col gap-2">
		<ULabel class="text-[15px] font-normal text-foreground">Повод обращения</ULabel>
		<UTextarea bind:value={reason} placeholder="Что беспокоит питомца?" />
	</div>

	{#if prepAlert}
		<Alert.Root variant="warning">
			<Info />
			<Alert.Description>{prepAlert}</Alert.Description>
		</Alert.Root>
	{/if}

	<UButton type="submit" size="lg" class="w-full">Записаться</UButton>
</form>
