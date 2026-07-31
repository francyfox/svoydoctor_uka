import { createDirectus, staticToken, rest, readSingleton } from '@directus/sdk';
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

type HeroBlockRow = { title: string; description?: string; link?: string; backgroundImage: string | null };
type HeroAdvantageRow = { text: string; icon: string | null };
type ServiceItemRow = { label: string; description?: string; illustration: string | null; ctaLabel: string };
type SymptomItemRow = { text: string; species?: 'cat' | 'dog' | 'both' };
type WeHelpItemRow = { title: string; description?: string; photo: string | null; link?: string };

type SettingsTranslationRow = {
	id: number;
	languages_code: string;
	address?: string;
	hours_weekday?: string;
	hours_saturday?: string;
	rating_label?: string;
};
type SettingsRow = {
	id: number;
	site_name: string;
	phone: string;
	logo: string | null;
	off_days: string;
	rating_value: string;
	reviews_url: string;
	map_embed_url: string;
	clinic_photo: string | null;
	translations: SettingsTranslationRow[];
};

type SectionHeroTranslationRow = {
	id: number;
	languages_code: string;
	blocks: HeroBlockRow[];
	advantages: HeroAdvantageRow[];
};
type SectionHeroRow = { id: number; translations: SectionHeroTranslationRow[] };

type SectionServicesTranslationRow = { id: number; languages_code: string; items: ServiceItemRow[] };
type SectionServicesRow = { id: number; translations: SectionServicesTranslationRow[] };

type SectionSymptomsTranslationRow = {
	id: number;
	languages_code: string;
	title?: string;
	subtitle?: string;
	symptoms: SymptomItemRow[];
};
type SectionSymptomsRow = { id: number; translations: SectionSymptomsTranslationRow[] };

type SectionWeHelpTranslationRow = { id: number; languages_code: string; title?: string; items: WeHelpItemRow[] };
type SectionWeHelpRow = { id: number; translations: SectionWeHelpTranslationRow[] };

type Schema = {
	settings: SettingsRow;
	settings_translations: SettingsTranslationRow[];
	section_hero: SectionHeroRow;
	section_hero_translations: SectionHeroTranslationRow[];
	section_services: SectionServicesRow;
	section_services_translations: SectionServicesTranslationRow[];
	section_symptoms: SectionSymptomsRow;
	section_symptoms_translations: SectionSymptomsTranslationRow[];
	section_we_help: SectionWeHelpRow;
	section_we_help_translations: SectionWeHelpTranslationRow[];
};

const client = createDirectus<Schema>(env.DIRECTUS_URL).with(staticToken(env.DIRECTUS_TOKEN)).with(rest());

function assetUrl(id: string | null | undefined): string | undefined {
	return id ? `${env.DIRECTUS_URL}/assets/${id}` : undefined;
}

export async function getSettings(locale: string): Promise<Settings> {
	const row = await client.request(
		readSingleton('settings', {
			fields: ['*', { translations: ['*'] }],
			deep: { translations: { _filter: { languages_code: { _eq: locale } } } }
		})
	);
	const t = row.translations?.[0];

	return {
		siteName: row.site_name,
		phone: row.phone,
		logoUrl: assetUrl(row.logo),
		address: t?.address || undefined,
		hoursWeekday: t?.hours_weekday || undefined,
		hoursSaturday: t?.hours_saturday || undefined,
		offDays: row.off_days
			? row.off_days
					.split(',')
					.map((value) => Number(value.trim()))
					.filter((value) => !Number.isNaN(value))
			: [],
		ratingValue: row.rating_value || undefined,
		ratingLabel: t?.rating_label || undefined,
		reviewsUrl: row.reviews_url || undefined,
		mapEmbedUrl: row.map_embed_url || undefined,
		clinicPhotoUrl: assetUrl(row.clinic_photo),
		directusId: row.id,
		translationId: t?.id
	};
}

export async function getSectionHero(locale: string): Promise<SectionHero> {
	const row = await client.request(
		readSingleton('section_hero', {
			fields: ['*', { translations: ['*'] }],
			deep: { translations: { _filter: { languages_code: { _eq: locale } } } }
		})
	);
	const t = row.translations?.[0];

	return {
		blocks: (t?.blocks ?? []).map((block) => ({
			title: block.title,
			description: block.description || undefined,
			link: block.link || undefined,
			backgroundImageUrl: assetUrl(block.backgroundImage)
		})),
		advantages: (t?.advantages ?? []).map((advantage) => ({
			text: advantage.text,
			iconUrl: assetUrl(advantage.icon)
		})),
		directusId: row.id,
		translationId: t?.id
	};
}

export async function getSectionServices(locale: string): Promise<SectionServices> {
	const row = await client.request(
		readSingleton('section_services', {
			fields: ['*', { translations: ['*'] }],
			deep: { translations: { _filter: { languages_code: { _eq: locale } } } }
		})
	);
	const t = row.translations?.[0];

	return {
		items: (t?.items ?? []).map((service) => ({
			label: service.label,
			description: service.description || undefined,
			illustrationUrl: assetUrl(service.illustration),
			ctaLabel: service.ctaLabel
		})),
		directusId: row.id,
		translationId: t?.id
	};
}

export async function getSectionSymptoms(locale: string): Promise<SectionSymptoms> {
	const row = await client.request(
		readSingleton('section_symptoms', {
			fields: ['*', { translations: ['*'] }],
			deep: { translations: { _filter: { languages_code: { _eq: locale } } } }
		})
	);
	const t = row.translations?.[0];

	return {
		title: t?.title ?? '',
		subtitle: t?.subtitle || undefined,
		symptoms: (t?.symptoms ?? []).map((symptom) => ({
			text: symptom.text,
			species: symptom.species ?? 'both'
		})),
		directusId: row.id,
		translationId: t?.id
	};
}

export async function getSectionWeHelp(locale: string): Promise<SectionWeHelp> {
	const row = await client.request(
		readSingleton('section_we_help', {
			fields: ['*', { translations: ['*'] }],
			deep: { translations: { _filter: { languages_code: { _eq: locale } } } }
		})
	);
	const t = row.translations?.[0];

	return {
		title: t?.title ?? '',
		items: (t?.items ?? []).map((weHelpItem) => ({
			title: weHelpItem.title,
			description: weHelpItem.description || undefined,
			photoUrl: assetUrl(weHelpItem.photo),
			link: weHelpItem.link || undefined
		})),
		directusId: row.id,
		translationId: t?.id
	};
}
