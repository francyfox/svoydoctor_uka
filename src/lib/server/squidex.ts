import { SquidexClient } from '@squidex/squidex';
import { env } from '$lib/server/env';
import type {
	Settings,
	HeroBlock,
	HeroAdvantage,
	SectionHero,
	ServiceItem,
	SectionServices,
	SymptomItem,
	SectionSymptoms,
	WeHelpItem,
	SectionWeHelp
} from '$lib/types/content';

export type {
	Settings,
	HeroBlock,
	HeroAdvantage,
	SectionHero,
	ServiceItem,
	SectionServices,
	SymptomItem,
	SectionSymptoms,
	WeHelpItem,
	SectionWeHelp
};

type SquidexToken = { accessToken: string; expiresIn: number; expiresAt: number };

/**
 * @squidex/squidex@2.0.1's built-in InMemoryTokenStore computes `expiresAt` as
 * `now + expiresIn` without converting `expiresIn` (seconds, per OAuth2) to milliseconds,
 * so the cached token is treated as expired almost immediately. Supplying our own
 * `tokenStore` (a documented SquidexOptions extension point) works around it without
 * patching node_modules.
 */
function createTokenStore() {
	let token: SquidexToken | undefined;

	return {
		get: () => token,
		set: (t: SquidexToken) => {
			token = { ...t, expiresAt: Date.now() + t.expiresIn * 1000 - 60_000 };
		},
		clear: () => {
			token = undefined;
		}
	};
}

const client = new SquidexClient({
	appName: env.SQUIDEX_APP,
	clientId: env.SQUIDEX_CLIENT_ID,
	clientSecret: env.SQUIDEX_CLIENT_SECRET,
	url: env.SQUIDEX_URL,
	tokenStore: createTokenStore()
});

export type SquidexAsset = string[];

export type SettingsData = {
	siteName: { iv: string };
	phone: { iv: string };
	logo: { iv: SquidexAsset };
	address: Record<string, string>;
	hoursWeekday: Record<string, string>;
	hoursSaturday: Record<string, string>;
	offDays: { iv: string };
	ratingValue: { iv: string };
	ratingLabel: Record<string, string>;
	reviewsUrl: { iv: string };
	mapEmbedUrl: { iv: string };
	clinicPhoto?: { iv: SquidexAsset };
};

export type HeroBlockData = {
	title: string;
	description?: string;
	link?: string;
	backgroundImage: SquidexAsset;
};

export type HeroAdvantageData = {
	text: string;
	icon: SquidexAsset;
};

export type SectionHeroData = {
	blocks: Record<string, HeroBlockData[]>;
	advantages: Record<string, HeroAdvantageData[]>;
};

export type ServiceItemData = {
	label: string;
	description?: string;
	illustration: SquidexAsset;
	ctaLabel: string;
};

export type SectionServicesData = {
	items: Record<string, ServiceItemData[]>;
};

export type SymptomItemData = {
	text: string;
	species?: 'cat' | 'dog' | 'both';
};

export type SectionSymptomsData = {
	title: Record<string, string>;
	subtitle?: Record<string, string>;
	symptoms: Record<string, SymptomItemData[]>;
};

export type WeHelpItemData = {
	title: string;
	description?: string;
	photo: SquidexAsset;
	link?: string;
};

export type SectionWeHelpData = {
	title: Record<string, string>;
	items: Record<string, WeHelpItemData[]>;
};

function assetUrl(asset: SquidexAsset | undefined): string | undefined {
	const id = asset?.[0];
	return id ? `${env.SQUIDEX_URL}/api/assets/${env.SQUIDEX_APP}/${id}` : undefined;
}

export async function getSettings(locale: string): Promise<Settings> {
	const result = await client.contents.getContents('settings', {});
	const item = result.items[0];
	const data = item.data as SettingsData;

	return {
		siteName: data.siteName.iv,
		phone: data.phone.iv,
		logoUrl: assetUrl(data.logo.iv),
		address: data.address?.[locale],
		hoursWeekday: data.hoursWeekday?.[locale],
		hoursSaturday: data.hoursSaturday?.[locale],
		offDays: data.offDays?.iv
			? data.offDays.iv
					.split(',')
					.map((value) => Number(value.trim()))
					.filter((value) => !Number.isNaN(value))
			: [],
		ratingValue: data.ratingValue?.iv,
		ratingLabel: data.ratingLabel?.[locale],
		reviewsUrl: data.reviewsUrl?.iv || undefined,
		mapEmbedUrl: data.mapEmbedUrl?.iv || undefined,
		clinicPhotoUrl: assetUrl(data.clinicPhoto?.iv),
		editToken: item.editToken ?? undefined
	};
}

export async function getSectionServices(locale: string): Promise<SectionServices> {
	const result = await client.contents.getContents('section-services', {});
	const item = result.items[0];
	const data = item.data as SectionServicesData;
	const items = data.items[locale] ?? [];

	return {
		items: items.map((service) => ({
			label: service.label,
			description: service.description,
			illustrationUrl: assetUrl(service.illustration),
			ctaLabel: service.ctaLabel
		})),
		editToken: item.editToken ?? undefined
	};
}

export async function getSectionSymptoms(locale: string): Promise<SectionSymptoms> {
	const result = await client.contents.getContents('section-symptoms', {});
	const item = result.items[0];
	const data = item.data as SectionSymptomsData;
	const symptoms = data.symptoms[locale] ?? [];

	return {
		title: data.title[locale],
		subtitle: data.subtitle?.[locale],
		symptoms: symptoms.map((symptom) => ({
			text: symptom.text,
			species: symptom.species ?? 'both'
		})),
		editToken: item.editToken ?? undefined
	};
}

export async function getSectionWeHelp(locale: string): Promise<SectionWeHelp> {
	const result = await client.contents.getContents('section-we-help', {});
	const item = result.items[0];
	const data = item.data as SectionWeHelpData;
	const items = data.items[locale] ?? [];

	return {
		title: data.title[locale],
		items: items.map((weHelpItem) => ({
			title: weHelpItem.title,
			description: weHelpItem.description,
			photoUrl: assetUrl(weHelpItem.photo),
			link: weHelpItem.link
		})),
		editToken: item.editToken ?? undefined
	};
}

export async function getSectionHero(locale: string): Promise<SectionHero> {
	const result = await client.contents.getContents('section-hero', {});
	const item = result.items[0];
	const data = item.data as SectionHeroData;
	const blocks = data.blocks[locale] ?? [];
	const advantages = data.advantages[locale] ?? [];

	return {
		blocks: blocks.map((block) => ({
			title: block.title,
			description: block.description,
			link: block.link,
			backgroundImageUrl: assetUrl(block.backgroundImage)
		})),
		advantages: advantages.map((advantage) => ({
			text: advantage.text,
			iconUrl: assetUrl(advantage.icon)
		})),
		editToken: item.editToken ?? undefined
	};
}
