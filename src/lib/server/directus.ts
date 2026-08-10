import { createDirectus, staticToken, rest, readSingleton } from '@directus/sdk';
import { env } from '$lib/server/env';
import type {
	Settings,
	HeroBlock,
	HeroAdvantage,
	HeroLink,
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
	HeroLink,
	SectionHero,
	ServiceItem,
	SectionServices,
	SymptomItem,
	SectionSymptoms,
	WeHelpItem,
	SectionWeHelp
};

type DirectusFileRow = { id: string; type: string | null; description: string | null };
type HeroBlockRow = {
	id: number;
	title: string;
	description: string | null;
	media: DirectusFileRow | null;
};
type HeroAdvantageRow = { id: number; text: string; icon: string | null };
type HeroLinkRow = { id: number; label: string; href: string };
type ServiceItemRow = {
	id: number;
	label: string;
	description: string | null;
	illustration: DirectusFileRow | null;
	cta_label: string;
};
type SymptomItemRow = { id: number; text: string; species: 'cat' | 'dog' | 'both' | null };
type WeHelpItemRow = {
	id: number;
	title: string;
	description: string | null;
	photo: DirectusFileRow | null;
	link: string | null;
};

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
	logo: DirectusFileRow | null;
	off_days: string;
	rating_value: string;
	reviews_url: string;
	map_embed_url: string;
	clinic_photo: DirectusFileRow | null;
	translations: SettingsTranslationRow[];
};

type SectionHeroTranslationRow = {
	id: number;
	languages_code: string;
	blocks: HeroBlockRow[];
	advantages: HeroAdvantageRow[];
	links: HeroLinkRow[];
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
	directus_files: DirectusFileRow;
	settings: SettingsRow;
	settings_translations: SettingsTranslationRow[];
	section_hero: SectionHeroRow;
	section_hero_translations: SectionHeroTranslationRow[];
	section_hero_block: HeroBlockRow[];
	section_hero_advantage: HeroAdvantageRow[];
	section_hero_link: HeroLinkRow[];
	section_services: SectionServicesRow;
	section_services_translations: SectionServicesTranslationRow[];
	section_services_item: ServiceItemRow[];
	section_symptoms: SectionSymptomsRow;
	section_symptoms_translations: SectionSymptomsTranslationRow[];
	section_symptom: SymptomItemRow[];
	section_we_help: SectionWeHelpRow;
	section_we_help_translations: SectionWeHelpTranslationRow[];
	section_we_help_item: WeHelpItemRow[];
};

const client = createDirectus<Schema>(env.DIRECTUS_URL).with(staticToken(env.DIRECTUS_TOKEN)).with(rest());

export async function getSettings(locale: string): Promise<Settings> {
	const row = await client.request(
		readSingleton('settings', {
			fields: [
				'*',
				{ logo: ['id', 'description'], clinic_photo: ['id', 'description'] },
				{ translations: ['*'] }
			],
			deep: { translations: { _filter: { languages_code: { _eq: locale } } } }
		})
	);
	const t = row.translations?.[0];

	return {
		siteName: row.site_name,
		phone: row.phone,
		logoId: row.logo?.id || undefined,
		logoAlt: row.logo?.description || undefined,
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
		clinicPhotoId: row.clinic_photo?.id || undefined,
		clinicPhotoAlt: row.clinic_photo?.description || undefined,
		directusId: row.id,
		translationId: t?.id
	};
}

export async function getSectionHero(locale: string): Promise<SectionHero> {
	const row = await client.request(
		readSingleton('section_hero', {
			fields: [
				'id',
				{
					translations: [
						'id',
						'languages_code',
						{
							blocks: ['id', 'title', 'description', { media: ['id', 'type', 'description'] }],
							advantages: ['*'],
							links: ['id', 'label', 'href']
						}
					]
				}
			],
			deep: {
				translations: { _filter: { languages_code: { _eq: locale } } },
				'translations.blocks': { _sort: ['sort'] },
				'translations.advantages': { _sort: ['sort'] },
				'translations.links': { _sort: ['sort'] }
			}
		})
	);
	const t = row.translations?.[0];

	return {
		blocks: (t?.blocks ?? []).map((block) => ({
			id: block.id,
			title: block.title,
			description: block.description || undefined,
			link: undefined,
			background: block.media
				? {
						id: block.media.id,
						kind: block.media.type?.startsWith('video/') ? ('video' as const) : ('image' as const),
						alt: block.media.description || undefined
					}
				: undefined
		})),
		advantages: (t?.advantages ?? []).map((advantage) => ({
			id: advantage.id,
			text: advantage.text,
			iconId: advantage.icon || undefined
		})),
		links: (t?.links ?? []).map((link) => ({
			id: link.id,
			label: link.label,
			href: link.href
		})),
		directusId: row.id,
		translationId: t?.id
	};
}

export async function getSectionServices(locale: string): Promise<SectionServices> {
	const row = await client.request(
		readSingleton('section_services', {
			fields: [
				'id',
				{
					translations: [
						'id',
						'languages_code',
						{ items: ['*', { illustration: ['id', 'description'] }] }
					]
				}
			],
			deep: {
				translations: { _filter: { languages_code: { _eq: locale } } },
				'translations.items': { _sort: ['sort'] }
			}
		})
	);
	const t = row.translations?.[0];

	return {
		items: (t?.items ?? []).map((service) => ({
			id: service.id,
			label: service.label,
			description: service.description || undefined,
			illustrationId: service.illustration?.id || undefined,
			illustrationAlt: service.illustration?.description || undefined,
			ctaLabel: service.cta_label
		})),
		directusId: row.id,
		translationId: t?.id
	};
}

export async function getSectionSymptoms(locale: string): Promise<SectionSymptoms> {
	const row = await client.request(
		readSingleton('section_symptoms', {
			fields: ['id', { translations: ['id', 'languages_code', 'title', 'subtitle', { symptoms: ['*'] }] }],
			deep: {
				translations: { _filter: { languages_code: { _eq: locale } } },
				'translations.symptoms': { _sort: ['sort'] }
			}
		})
	);
	const t = row.translations?.[0];

	return {
		title: t?.title ?? '',
		subtitle: t?.subtitle || undefined,
		symptoms: (t?.symptoms ?? []).map((symptom) => ({
			id: symptom.id,
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
			fields: [
				'id',
				{
					translations: [
						'id',
						'languages_code',
						'title',
						{ items: ['*', { photo: ['id', 'description'] }] }
					]
				}
			],
			deep: {
				translations: { _filter: { languages_code: { _eq: locale } } },
				'translations.items': { _sort: ['sort'] }
			}
		})
	);
	const t = row.translations?.[0];

	return {
		title: t?.title ?? '',
		items: (t?.items ?? []).map((weHelpItem) => ({
			id: weHelpItem.id,
			title: weHelpItem.title,
			description: weHelpItem.description || undefined,
			photoId: weHelpItem.photo?.id || undefined,
			photoAlt: weHelpItem.photo?.description || undefined,
			link: weHelpItem.link || undefined
		})),
		directusId: row.id,
		translationId: t?.id
	};
}
