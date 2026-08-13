import { createDirectus, staticToken, rest, readSingleton, readItems, readFieldsByCollection, createItem } from '@directus/sdk';
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
	SectionWeHelp,
	PageSection,
	PageMeta,
	PageMetaKey,
	SocialLink,
	FormCollection,
	FormFieldSchema
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
	SectionWeHelp,
	PageSection,
	PageMeta,
	PageMetaKey,
	SocialLink,
	FormCollection,
	FormFieldSchema
};

type DirectusFileRow = { id: string; type: string | null; description: string | null };
type HeroBlockRow = {
	id: number;
	title: string;
	description: string | null;
	link: string | null;
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
	featured: boolean;
};

type SettingsTranslationRow = {
	id: number;
	languages_code: string;
	address?: string;
	hours_weekday?: string;
	hours_saturday?: string;
	rating_label?: string;
	hotline_banner_text?: string | null;
};
type SettingsRow = {
	id: number;
	site_name: string;
	phone: string;
	logo: DirectusFileRow | null;
	favicon: DirectusFileRow | null;
	off_days: string;
	rating_value: string;
	reviews_url: string;
	clinic_photo: DirectusFileRow | null;
	hotline_banner_enabled: boolean;
	maintenance_mode_enabled: boolean;
	mapbox_token: string | null;
	mapbox_style_url: string | null;
	mapbox_zoom: number | null;
	map: { type: 'Point'; coordinates: [number, number] } | null;
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

type SectionServicesTranslationRow = {
	id: number;
	languages_code: string;
	title?: string;
	items: ServiceItemRow[];
};
type SectionServicesRow = { id: number; translations: SectionServicesTranslationRow[] };

type SectionSymptomsTranslationRow = {
	id: number;
	languages_code: string;
	title?: string;
	subtitle?: string;
	cat_label?: string;
	dog_label?: string;
	symptoms: SymptomItemRow[];
};
type SectionSymptomsRow = {
	id: number;
	slider_autoplay: boolean;
	slider_speed: number;
	slider_interval: number;
	cat_icon: string | null;
	dog_icon: string | null;
	translations: SectionSymptomsTranslationRow[];
};

type SectionWeHelpTranslationRow = { id: number; languages_code: string; title?: string; items: WeHelpItemRow[] };
type SectionWeHelpRow = {
	id: number;
	slider_autoplay: boolean;
	slider_speed: number;
	slider_interval: number;
	translations: SectionWeHelpTranslationRow[];
};

type PageSectionRow = {
	id: number;
	sort: number;
	section_key: string;
	visible: boolean;
	shader: string;
};

type PageMetaTranslationRow = {
	id: number;
	languages_code: string;
	meta_title?: string;
	meta_description?: string | null;
};
type PageMetaRow = {
	id: number;
	route: string;
	noindex: boolean;
	og_image: DirectusFileRow | null;
	translations: PageMetaTranslationRow[];
};

type SocialLinkRow = {
	id: number;
	sort: number | null;
	label: string;
	url: string;
	icon: string | null;
	image: DirectusFileRow | null;
	color: string | null;
	enabled: boolean;
};

type Schema = {
	directus_files: DirectusFileRow;
	page_sections: PageSectionRow[];
	page_meta: PageMetaRow[];
	page_meta_translations: PageMetaTranslationRow[];
	social_links: SocialLinkRow[];
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
	booking_requests: BookingRequestRow[];
	sterilization_requests: SterilizationRequestRow[];
};

type FormChoiceRaw = { text: string; value: string; icon?: string };

type BookingRequestRow = {
	id: number;
	service: string;
	pet_type: string;
	pet_type_other: string | null;
	name: string;
	phone: string;
	preferred_date: string | null;
	reason: string | null;
};

type SterilizationRequestRow = {
	id: number;
	pet_type: string;
	pet_sex: string;
	name: string;
	phone: string;
	preferred_date: string | null;
	reason: string | null;
};

const client = createDirectus<Schema>(env.DIRECTUS_URL).with(staticToken(env.DIRECTUS_TOKEN)).with(rest());

export async function getSettings(locale: string): Promise<Settings> {
	const row = await client.request(
		readSingleton('settings', {
			fields: [
				'*',
				{
					logo: ['id', 'description'],
					clinic_photo: ['id', 'description'],
					favicon: ['id', 'description']
				},
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
		faviconId: row.favicon?.id || undefined,
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
		clinicPhotoId: row.clinic_photo?.id || undefined,
		clinicPhotoAlt: row.clinic_photo?.description || undefined,
		hotlineBannerEnabled: row.hotline_banner_enabled ?? false,
		hotlineBannerText: t?.hotline_banner_text || undefined,
		maintenanceModeEnabled: row.maintenance_mode_enabled ?? false,
		mapbox:
			row.mapbox_token && row.map
				? {
						token: row.mapbox_token,
						styleUrl: row.mapbox_style_url || 'mapbox://styles/mapbox/streets-v12',
						lng: row.map.coordinates[0],
						lat: row.map.coordinates[1],
						zoom: row.mapbox_zoom ?? 15
					}
				: undefined,
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
							blocks: ['id', 'title', 'description', 'link', { media: ['id', 'type', 'description'] }],
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
			link: block.link || undefined,
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
			iconName: advantage.icon || undefined
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
						'title',
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
		title: t?.title ?? '',
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
			fields: [
				'id',
				'slider_autoplay',
				'slider_speed',
				'slider_interval',
				'cat_icon',
				'dog_icon',
				{
					translations: [
						'id',
						'languages_code',
						'title',
						'subtitle',
						'cat_label',
						'dog_label',
						{ symptoms: ['*'] }
					]
				}
			],
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
		catLabel: t?.cat_label ?? '',
		dogLabel: t?.dog_label ?? '',
		catIconName: row.cat_icon || undefined,
		dogIconName: row.dog_icon || undefined,
		slider: {
			autoplay: row.slider_autoplay ?? true,
			speed: row.slider_speed ?? 600,
			interval: row.slider_interval ?? 3500
		},
		directusId: row.id,
		translationId: t?.id
	};
}

export async function getSectionWeHelp(locale: string): Promise<SectionWeHelp> {
	const row = await client.request(
		readSingleton('section_we_help', {
			fields: [
				'id',
				'slider_autoplay',
				'slider_speed',
				'slider_interval',
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
			link: weHelpItem.link || undefined,
			featured: weHelpItem.featured ?? false
		})),
		slider: {
			autoplay: row.slider_autoplay ?? true,
			speed: row.slider_speed ?? 600,
			interval: row.slider_interval ?? 3500
		},
		directusId: row.id,
		translationId: t?.id
	};
}

export async function getPageSections(): Promise<PageSection[]> {
	const rows = await client.request(
		readItems('page_sections', {
			fields: ['section_key', 'visible', 'shader'],
			sort: ['sort']
		})
	);

	return rows.map((row) => ({ key: row.section_key, visible: row.visible, shader: row.shader }));
}

export async function getPageMeta(key: PageMetaKey, locale: string): Promise<PageMeta> {
	const rows = await client.request(
		readItems('page_meta', {
			fields: [
				'noindex',
				{ og_image: ['id'] },
				{ translations: ['meta_title', 'meta_description'] }
			],
			filter: { route: { _eq: key } },
			deep: { translations: { _filter: { languages_code: { _eq: locale } } } },
			limit: 1
		})
	);
	const row = rows[0];
	const t = row?.translations?.[0];

	return {
		title: t?.meta_title ?? '',
		description: t?.meta_description || undefined,
		ogImageId: row?.og_image?.id || undefined,
		noindex: row?.noindex ?? false
	};
}

export async function getSocialLinks(): Promise<SocialLink[]> {
	const rows = await client.request(
		readItems('social_links', {
			fields: ['id', 'label', 'url', 'icon', 'color', { image: ['id'] }],
			filter: { enabled: { _eq: true } },
			sort: ['sort']
		})
	);

	return rows.map((row) => ({
		id: row.id,
		label: row.label,
		url: row.url,
		iconName: row.icon || undefined,
		imageId: row.image?.id || undefined,
		color: row.color || undefined
	}));
}

export async function getFormSchema(collection: FormCollection): Promise<FormFieldSchema[]> {
	const fields = await client.request(readFieldsByCollection(collection));

	return fields
		.filter((field) => !field.meta?.hidden)
		.sort((a, b) => (a.meta?.sort ?? 0) - (b.meta?.sort ?? 0))
		.map((field) => {
			const options = field.meta?.options as
				| { choices?: FormChoiceRaw[]; placeholder?: string }
				| null;

			return {
				field: field.field,
				type: field.type,
				interface: field.meta?.interface ?? 'input',
				label: field.meta?.note ?? field.field,
				placeholder: options?.placeholder || undefined,
				required: field.meta?.required ?? false,
				choices: options?.choices?.map((choice) => ({
					text: choice.text,
					value: choice.value,
					icon: choice.icon || undefined
				}))
			};
		});
}

export async function createFormSubmission(
	collection: FormCollection,
	data: Record<string, string>
): Promise<void> {
	await client.request(createItem(collection, data));
}
