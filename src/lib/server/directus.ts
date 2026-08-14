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
	Page,
	PageSectionEntry,
	BlockEntry,
	SectionBlocks,
	SectionServicesPricelist,
	ServicesPromo,
	SocialLink,
	FormCollection,
	FormFieldSchema,
	ServicePriceItem,
	ServicePriceCategory
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
	Page,
	PageSectionEntry,
	BlockEntry,
	SectionBlocks,
	SectionServicesPricelist,
	ServicesPromo,
	SocialLink,
	FormCollection,
	FormFieldSchema,
	ServicePriceItem,
	ServicePriceCategory
};

type DirectusFileRow = { id: string; type: string | null; description: string | null };

// Block primitives (docs/global/blocks/) — the atomic, polymorphic content pieces
// referenced through M2A "item" pointers from section-level slot junction rows.
type BlockMediaCardRow = {
	id: number;
	title: string;
	description: string | null;
	media: DirectusFileRow | null;
	href: string | null;
};
type BlockIconLabelRow = { id: number; icon: string | null; label: string };
type BlockLinkRow = { id: number; label: string; href: string | null };

// Section-level slot junction rows (docs/global/sections/) — same shape as page_sections,
// one level deeper: id/sort/ref_id(hidden)/collection/item, plus any slot-specific extension
// field (role, cta_label, featured). `item` is typed as the single block shape each slot is
// currently restricted to (one_allowed_collections), not a true polymorphic union.
type SectionHeroTileRow = { id: number; role: HeroTileRoleRow; item: BlockMediaCardRow };
type SectionHeroAdvantageRow = { id: number; item: BlockIconLabelRow };
type SectionHeroLinkRow = { id: number; item: BlockLinkRow };
type HeroTileRoleRow = 'title' | 'photo' | 'promo' | 'spare' | 'media';

type SectionServicesItemRow = { id: number; cta_label: string | null; item: BlockMediaCardRow };

type SymptomItemRow = { id: number; text: string; species: 'cat' | 'dog' | 'both' | null };

type SectionWeHelpItemRow = { id: number; featured: boolean; item: BlockMediaCardRow };

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
	tiles: SectionHeroTileRow[];
	advantages: SectionHeroAdvantageRow[];
	links: SectionHeroLinkRow[];
};
type SectionHeroRow = { id: number; key: string; translations: SectionHeroTranslationRow[] };

type SectionServicesTranslationRow = {
	id: number;
	languages_code: string;
	title?: string;
	items: SectionServicesItemRow[];
};
type SectionServicesRow = { id: number; key: string; translations: SectionServicesTranslationRow[] };

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
	key: string;
	slider_autoplay: boolean;
	slider_speed: number;
	slider_interval: number;
	cat_icon: string | null;
	dog_icon: string | null;
	translations: SectionSymptomsTranslationRow[];
};

type SectionWeHelpTranslationRow = {
	id: number;
	languages_code: string;
	title?: string;
	items: SectionWeHelpItemRow[];
};
type SectionWeHelpRow = {
	id: number;
	key: string;
	slider_autoplay: boolean;
	slider_speed: number;
	slider_interval: number;
	translations: SectionWeHelpTranslationRow[];
};

type PageTranslationRow = {
	id: number;
	languages_code: string;
	title: string;
	description: string | null;
	og_image: DirectusFileRow | null;
};
type PageRow = {
	id: number;
	key: string;
	noindex: boolean;
	status: string;
	show_in_menu: boolean;
	translations: PageTranslationRow[];
};

type BlockListItemRow = { id: number; label: string; href: string | null };
type BlockListRow = { id: number; title: string | null; items: BlockListItemRow[] };
type SectionBlocksItemRawRow = {
	id: number;
	collection: string;
	item: BlockMediaCardRow | BlockIconLabelRow | BlockLinkRow | BlockListRow;
};
type SectionBlocksTranslationRow = {
	id: number;
	languages_code: string;
	title: string | null;
	description: string | null;
	items: SectionBlocksItemRawRow[];
};
type SectionBlocksRow = { id: number; key: string; translations: SectionBlocksTranslationRow[] };

type SectionServicesPromoTranslationRow = { id: number; languages_code: string; title: string | null; description: string | null };
type SectionServicesPromoRow = {
	id: number;
	key: string;
	enabled: boolean;
	price: number | null;
	original_price: number | null;
	valid_until: string | null;
	translations: SectionServicesPromoTranslationRow[];
};

type SectionServicesPricelistTranslationRow = {
	id: number;
	languages_code: string;
	title: string | null;
	note: string | null;
	categories: ServicePriceCategoryRow[];
};
type SectionServicesPricelistRow = { id: number; key: string; translations: SectionServicesPricelistTranslationRow[] };

type PageSectionRow = {
	id: number;
	sort: number;
	collection: string;
	item: string;
	visible: boolean;
	shader: string;
};

type ServicePriceItemRow = { id: number; label: string; price: number };
type ServicePriceCategoryRow = { id: number; title: string; items: ServicePriceItemRow[] };

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
	pages: PageRow[];
	pages_translations: PageTranslationRow[];
	page_sections: PageSectionRow[];
	social_links: SocialLinkRow[];
	settings: SettingsRow;
	settings_translations: SettingsTranslationRow[];
	block_media_card: BlockMediaCardRow[];
	block_icon_label: BlockIconLabelRow[];
	block_link: BlockLinkRow[];
	block_list: BlockListRow[];
	section_hero: SectionHeroRow[];
	section_hero_translations: SectionHeroTranslationRow[];
	section_hero_tile: SectionHeroTileRow[];
	section_hero_advantage: SectionHeroAdvantageRow[];
	section_hero_link: SectionHeroLinkRow[];
	section_services: SectionServicesRow[];
	section_services_translations: SectionServicesTranslationRow[];
	section_services_item: SectionServicesItemRow[];
	section_symptoms: SectionSymptomsRow[];
	section_symptoms_translations: SectionSymptomsTranslationRow[];
	section_symptom: SymptomItemRow[];
	section_we_help: SectionWeHelpRow[];
	section_we_help_translations: SectionWeHelpTranslationRow[];
	section_we_help_item: SectionWeHelpItemRow[];
	section_contacts: { id: number; key: string }[];
	section_blocks: SectionBlocksRow[];
	section_blocks_translations: SectionBlocksTranslationRow[];
	section_blocks_item: SectionBlocksItemRawRow[];
	section_services_promo: SectionServicesPromoRow[];
	section_services_promo_translations: SectionServicesPromoTranslationRow[];
	section_services_pricelist: SectionServicesPricelistRow[];
	section_services_pricelist_translations: SectionServicesPricelistTranslationRow[];
	service_price_category: ServicePriceCategoryRow[];
	service_price_item: ServicePriceItemRow[];
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

async function getSectionHero(id: number, locale: string): Promise<SectionHero> {
	// `tiles` is genuinely polymorphic (block_media_card + block_list allowed) — Directus can't
	// infer which collection's fields to resolve without the `item:collection.field` qualifier
	// here, unlike the single-allowed-collection slots below (advantages/links), where it
	// resolves `item.field` unqualified since there's only one possible type. The SDK's field-path
	// typing can't express this qualifier syntax, hence the `as any` on the request — the response
	// is cast straight back to the real row shape below, so nothing downstream loses type safety.
	// Only block_media_card has real content today; block_list stays unconsumed until a tile of
	// that type actually exists (see docs/global/blocks/primitives).
	const row = (await client.request(
		readItems('section_hero', {
			filter: { id: { _eq: id } },
			limit: 1,
			fields: [
				'id',
				{
					translations: [
						'id',
						'languages_code',
						{
							tiles: [
								'id',
								'role',
								'item:block_media_card.id',
								'item:block_media_card.title',
								'item:block_media_card.description',
								'item:block_media_card.href',
								'item:block_media_card.media.id',
								'item:block_media_card.media.type',
								'item:block_media_card.media.description'
							],
							advantages: ['id', { item: ['id', 'icon', 'label'] }],
							links: ['id', { item: ['id', 'label', 'href'] }]
						}
					]
				}
			],
			deep: {
				translations: { _filter: { languages_code: { _eq: locale } } },
				'translations.tiles': { _sort: ['sort'] },
				'translations.advantages': { _sort: ['sort'] },
				'translations.links': { _sort: ['sort'] }
			}
		} as unknown as never)
	)) as SectionHeroRow[];
	const t = row[0]?.translations?.[0];

	return {
		blocks: (t?.tiles ?? []).map((tile) => ({
			id: tile.item.id,
			role: tile.role,
			title: tile.item.title,
			description: tile.item.description || undefined,
			link: tile.item.href || undefined,
			background: tile.item.media
				? {
						id: tile.item.media.id,
						kind: tile.item.media.type?.startsWith('video/') ? ('video' as const) : ('image' as const),
						alt: tile.item.media.description || undefined
					}
				: undefined
		})),
		advantages: (t?.advantages ?? []).map((advantage) => ({
			id: advantage.item.id,
			text: advantage.item.label,
			iconName: advantage.item.icon || undefined
		})),
		links: (t?.links ?? []).map((link) => ({
			id: link.item.id,
			label: link.item.label,
			href: link.item.href ?? ''
		})),
		directusId: row[0]?.id,
		translationId: t?.id
	};
}

async function getSectionServices(id: number, locale: string): Promise<SectionServices> {
	const row = await client.request(
		readItems('section_services', {
			filter: { id: { _eq: id } },
			limit: 1,
			fields: [
				'id',
				{
					translations: [
						'id',
						'languages_code',
						'title',
						{
							items: [
								'id',
								'cta_label',
								{ item: ['id', 'title', 'description', { media: ['id', 'description'] }] }
							]
						}
					]
				}
			],
			deep: {
				translations: { _filter: { languages_code: { _eq: locale } } },
				'translations.items': { _sort: ['sort'] }
			}
		})
	);
	const t = row[0]?.translations?.[0];

	return {
		title: t?.title ?? '',
		items: (t?.items ?? []).map((service) => ({
			id: service.item.id,
			label: service.item.title,
			description: service.item.description || undefined,
			illustrationId: service.item.media?.id || undefined,
			illustrationAlt: service.item.media?.description || undefined,
			ctaLabel: service.cta_label ?? ''
		})),
		directusId: row[0]?.id,
		translationId: t?.id
	};
}

// The dedicated /services route reuses the same section_services content as the homepage
// preview (see CLAUDE.md), independent of whichever page(s) currently link it in via
// page_sections — so it looks the instance up by its stable `key`, not through a page.
export async function getServicesSection(locale: string): Promise<SectionServices> {
	const rows = await client.request(
		readItems('section_services', { filter: { key: { _eq: 'services-main' } }, limit: 1, fields: ['id'] })
	);
	const id = rows[0]?.id;
	if (id === undefined) return { title: '', items: [], directusId: undefined, translationId: undefined };
	return getSectionServices(id, locale);
}

async function getSectionSymptoms(id: number, locale: string): Promise<SectionSymptoms> {
	const row = await client.request(
		readItems('section_symptoms', {
			filter: { id: { _eq: id } },
			limit: 1,
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
	const row0 = row[0];
	const t = row0?.translations?.[0];

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
		catIconName: row0?.cat_icon || undefined,
		dogIconName: row0?.dog_icon || undefined,
		slider: {
			autoplay: row0?.slider_autoplay ?? true,
			speed: row0?.slider_speed ?? 600,
			interval: row0?.slider_interval ?? 3500
		},
		directusId: row0?.id,
		translationId: t?.id
	};
}

async function getSectionWeHelp(id: number, locale: string): Promise<SectionWeHelp> {
	const row = await client.request(
		readItems('section_we_help', {
			filter: { id: { _eq: id } },
			limit: 1,
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
						{
							items: [
								'id',
								'featured',
								{ item: ['id', 'title', 'description', 'href', { media: ['id', 'description'] }] }
							]
						}
					]
				}
			],
			deep: {
				translations: { _filter: { languages_code: { _eq: locale } } },
				'translations.items': { _sort: ['sort'] }
			}
		})
	);
	const row0 = row[0];
	const t = row0?.translations?.[0];

	return {
		title: t?.title ?? '',
		items: (t?.items ?? []).map((weHelpItem) => ({
			id: weHelpItem.item.id,
			title: weHelpItem.item.title,
			description: weHelpItem.item.description || undefined,
			photoId: weHelpItem.item.media?.id || undefined,
			photoAlt: weHelpItem.item.media?.description || undefined,
			link: weHelpItem.item.href || undefined,
			featured: weHelpItem.featured ?? false
		})),
		slider: {
			autoplay: row0?.slider_autoplay ?? true,
			speed: row0?.slider_speed ?? 600,
			interval: row0?.slider_interval ?? 3500
		},
		directusId: row0?.id,
		translationId: t?.id
	};
}

async function getSectionBlocks(id: number, locale: string): Promise<SectionBlocks> {
	// `items` is genuinely polymorphic across all 4 block primitives — same qualifier
	// requirement as section_hero's `tiles` slot (see §6 of the directus skill).
	const row = (await client.request(
		readItems('section_blocks', {
			filter: { id: { _eq: id } },
			limit: 1,
			fields: [
				'id',
				{
					translations: [
						'id',
						'languages_code',
						'title',
						'description',
						{
							items: [
								'id',
								'collection',
								'item:block_media_card.id',
								'item:block_media_card.title',
								'item:block_media_card.description',
								'item:block_media_card.href',
								'item:block_media_card.media.id',
								'item:block_media_card.media.type',
								'item:block_media_card.media.description',
								'item:block_icon_label.id',
								'item:block_icon_label.icon',
								'item:block_icon_label.label',
								'item:block_link.id',
								'item:block_link.label',
								'item:block_link.href',
								'item:block_list.id',
								'item:block_list.title',
								'item:block_list.items.id',
								'item:block_list.items.label',
								'item:block_list.items.href'
							]
						}
					]
				}
			],
			deep: {
				translations: { _filter: { languages_code: { _eq: locale } } },
				'translations.items': { _sort: ['sort'] }
			}
		} as unknown as never)
	)) as SectionBlocksRow[];
	const t = row[0]?.translations?.[0];

	const items: BlockEntry[] = (t?.items ?? []).flatMap((raw): BlockEntry[] => {
		switch (raw.collection) {
			case 'block_media_card': {
				const b = raw.item as BlockMediaCardRow;
				return [
					{
						collection: 'block_media_card',
						data: {
							id: b.id,
							title: b.title,
							description: b.description || undefined,
							href: b.href || undefined,
							background: b.media
								? {
										id: b.media.id,
										kind: b.media.type?.startsWith('video/') ? ('video' as const) : ('image' as const),
										alt: b.media.description || undefined
									}
								: undefined
						}
					}
				];
			}
			case 'block_icon_label': {
				const b = raw.item as BlockIconLabelRow;
				return [{ collection: 'block_icon_label', data: { id: b.id, icon: b.icon || undefined, label: b.label } }];
			}
			case 'block_link': {
				const b = raw.item as BlockLinkRow;
				return [{ collection: 'block_link', data: { id: b.id, label: b.label, href: b.href || undefined } }];
			}
			case 'block_list': {
				const b = raw.item as BlockListRow;
				return [
					{
						collection: 'block_list',
						data: {
							id: b.id,
							title: b.title || undefined,
							items: (b.items ?? []).map((l) => ({ id: l.id, label: l.label, href: l.href || undefined }))
						}
					}
				];
			}
			default:
				return [];
		}
	});

	return {
		title: t?.title || undefined,
		description: t?.description || undefined,
		items,
		directusId: row[0]?.id,
		translationId: t?.id
	};
}

async function getSectionServicesPromo(id: number, locale: string): Promise<ServicesPromo | undefined> {
	const row = await client.request(
		readItems('section_services_promo', {
			filter: { id: { _eq: id } },
			limit: 1,
			fields: [
				'enabled',
				'price',
				'original_price',
				'valid_until',
				{ translations: ['id', 'languages_code', 'title', 'description'] }
			],
			deep: { translations: { _filter: { languages_code: { _eq: locale } } } }
		})
	);
	const row0 = row[0];
	if (!row0?.enabled) return undefined;
	const t = row0.translations?.[0];
	if (!t?.title) return undefined;

	return {
		title: t.title,
		description: t.description || undefined,
		price: row0.price ?? 0,
		originalPrice: row0.original_price || undefined,
		validUntil: row0.valid_until || undefined
	};
}

async function getSectionServicesPricelist(id: number, locale: string): Promise<SectionServicesPricelist> {
	const row = await client.request(
		readItems('section_services_pricelist', {
			filter: { id: { _eq: id } },
			limit: 1,
			fields: [
				'id',
				{
					translations: [
						'id',
						'languages_code',
						'title',
						'note',
						{ categories: ['id', 'title', { items: ['id', 'label', 'price'] }] }
					]
				}
			],
			deep: {
				translations: { _filter: { languages_code: { _eq: locale } } },
				'translations.categories': { _sort: ['sort'] },
				'translations.categories.items': { _sort: ['sort'] }
			}
		})
	);
	const t = row[0]?.translations?.[0];

	return {
		title: t?.title ?? '',
		note: t?.note || undefined,
		categories: (t?.categories ?? []).map((category) => ({
			id: category.id,
			title: category.title,
			items: (category.items ?? []).map((item) => ({ id: item.id, label: item.label, price: item.price }))
		})),
		directusId: row[0]?.id,
		translationId: t?.id
	};
}

export async function getPage(pageKey: string, locale: string): Promise<Page | undefined> {
	const pages = await client.request(
		readItems('pages', {
			filter: { key: { _eq: pageKey }, status: { _eq: 'published' } },
			limit: 1,
			fields: ['id', 'noindex', { translations: ['title', 'description', { og_image: ['id'] }] }],
			deep: { translations: { _filter: { languages_code: { _eq: locale } } } }
		})
	);
	const page = pages[0];
	if (page === undefined) return undefined;
	const pageT = page.translations?.[0];
	const pageId = page.id;

	const junctionRows = await client.request(
		readItems('page_sections', {
			filter: { page: { _eq: pageId }, visible: { _eq: true } },
			fields: ['collection', 'item', 'shader'],
			sort: ['sort']
		})
	);

	const sections = await Promise.all(
		junctionRows.map(async (row): Promise<PageSectionEntry | undefined> => {
			const id = Number(row.item);
			switch (row.collection) {
				case 'section_hero':
					return { key: 'hero', shader: row.shader, data: await getSectionHero(id, locale) };
				case 'section_services':
					return { key: 'services', shader: row.shader, data: await getSectionServices(id, locale) };
				case 'section_symptoms':
					return { key: 'symptoms', shader: row.shader, data: await getSectionSymptoms(id, locale) };
				case 'section_we_help':
					return { key: 'we_help', shader: row.shader, data: await getSectionWeHelp(id, locale) };
				case 'section_contacts':
					return { key: 'contacts', shader: row.shader };
				case 'section_blocks':
					return { key: 'blocks', shader: row.shader, data: await getSectionBlocks(id, locale) };
				case 'section_services_promo':
					return { key: 'services_promo', shader: row.shader, data: await getSectionServicesPromo(id, locale) };
				case 'section_services_pricelist':
					return { key: 'services_pricelist', shader: row.shader, data: await getSectionServicesPricelist(id, locale) };
				default:
					return undefined;
			}
		})
	);

	return {
		title: pageT?.title ?? '',
		description: pageT?.description || undefined,
		ogImageId: pageT?.og_image?.id || undefined,
		noindex: page.noindex ?? false,
		sections: sections.filter((s): s is PageSectionEntry => s !== undefined)
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
				})),
				// Directus's own admin-form width metadata ('full' | 'half' | 'half-space' | 'fill') —
				// reused here so the two-column layout comes from the same place editors already
				// use to lay out the Directus edit form, instead of a second width concept in code.
				width: field.meta?.width === 'full' ? 'full' : 'half'
			};
		});
}

export async function createFormSubmission(
	collection: FormCollection,
	data: Record<string, string>
): Promise<void> {
	await client.request(createItem(collection, data));
}
