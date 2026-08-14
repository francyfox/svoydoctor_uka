export type MapboxSettings = {
	token: string;
	styleUrl: string;
	lng: number;
	lat: number;
	zoom: number;
};

export type Settings = {
	siteName: string;
	phone: string;
	logoId: string | undefined;
	logoAlt: string | undefined;
	faviconId: string | undefined;
	address: string | undefined;
	hoursWeekday: string | undefined;
	hoursSaturday: string | undefined;
	offDays: number[];
	ratingValue: string | undefined;
	ratingLabel: string | undefined;
	reviewsUrl: string | undefined;
	clinicPhotoId: string | undefined;
	clinicPhotoAlt: string | undefined;
	hotlineBannerEnabled: boolean;
	hotlineBannerText: string | undefined;
	maintenanceModeEnabled: boolean;
	mapbox: MapboxSettings | undefined;
	directusId: number | undefined;
	translationId: number | undefined;
};

export type HeroBackgroundMedia = {
	id: string;
	kind: 'image' | 'video';
	alt: string | undefined;
};

export type HeroTileRole = 'title' | 'photo' | 'promo' | 'spare' | 'media';

export type HeroBlock = {
	id: number;
	role: HeroTileRole;
	title: string;
	description: string | undefined;
	link: string | undefined;
	background: HeroBackgroundMedia | undefined;
};

export type HeroAdvantage = {
	id: number;
	text: string;
	iconName: string | undefined;
};

export type HeroLink = {
	id: number;
	label: string;
	href: string;
};

export type SectionHero = {
	blocks: HeroBlock[];
	advantages: HeroAdvantage[];
	links: HeroLink[];
	directusId: number | undefined;
	translationId: number | undefined;
};

export type ServiceItem = {
	id: number;
	label: string;
	description: string | undefined;
	illustrationId: string | undefined;
	illustrationAlt: string | undefined;
	ctaLabel: string;
};

export type SectionServices = {
	title: string;
	items: ServiceItem[];
	directusId: number | undefined;
	translationId: number | undefined;
};

export type MediaCardBlockData = {
	id: number;
	title: string;
	description: string | undefined;
	background: HeroBackgroundMedia | undefined;
	href: string | undefined;
};

export type IconLabelBlockData = {
	id: number;
	icon: string | undefined;
	label: string;
};

export type LinkBlockData = {
	id: number;
	label: string;
	href: string | undefined;
};

export type ListBlockData = {
	id: number;
	title: string | undefined;
	items: LinkBlockData[];
};

export type BlockEntry =
	| { collection: 'block_media_card'; data: MediaCardBlockData }
	| { collection: 'block_icon_label'; data: IconLabelBlockData }
	| { collection: 'block_link'; data: LinkBlockData }
	| { collection: 'block_list'; data: ListBlockData };

export type SectionBlocks = {
	title: string | undefined;
	description: string | undefined;
	items: BlockEntry[];
	directusId: number | undefined;
	translationId: number | undefined;
};

export type SectionServicesPricelist = {
	title: string;
	note: string | undefined;
	categories: ServicePriceCategory[];
	directusId: number | undefined;
	translationId: number | undefined;
};

export type PageSectionEntry =
	| { key: 'hero'; shader: string; data: SectionHero }
	| { key: 'services'; shader: string; data: SectionServices }
	| { key: 'symptoms'; shader: string; data: SectionSymptoms }
	| { key: 'we_help'; shader: string; data: SectionWeHelp }
	| { key: 'contacts'; shader: string }
	| { key: 'blocks'; shader: string; data: SectionBlocks }
	| { key: 'services_promo'; shader: string; data: ServicesPromo | undefined }
	| { key: 'services_pricelist'; shader: string; data: SectionServicesPricelist };

export type Page = {
	title: string;
	description: string | undefined;
	ogImageId: string | undefined;
	noindex: boolean;
	sections: PageSectionEntry[];
};

export type SliderOptions = {
	autoplay: boolean;
	speed: number;
	interval: number;
};

export type SocialLink = {
	id: number;
	label: string;
	url: string;
	iconName: string | undefined;
	imageId: string | undefined;
	color: string | undefined;
};

export type SymptomSpecies = 'cat' | 'dog' | 'both';

export type SymptomItem = {
	id: number;
	text: string;
	species: SymptomSpecies;
};

export type SectionSymptoms = {
	title: string;
	subtitle: string | undefined;
	symptoms: SymptomItem[];
	slider: SliderOptions;
	catLabel: string;
	dogLabel: string;
	catIconName: string | undefined;
	dogIconName: string | undefined;
	directusId: number | undefined;
	translationId: number | undefined;
};

export type FormCollection = 'booking_requests' | 'sterilization_requests';

export type FormChoice = {
	text: string;
	value: string;
	icon: string | undefined;
};

export type FormFieldSchema = {
	field: string;
	type: string;
	interface: string;
	label: string;
	placeholder: string | undefined;
	required: boolean;
	choices: FormChoice[] | undefined;
	width: 'full' | 'half';
};

export type ServicePriceItem = {
	id: number;
	label: string;
	price: number;
};

export type ServicePriceCategory = {
	id: number;
	title: string;
	items: ServicePriceItem[];
};

export type ServicesPromo = {
	title: string;
	description: string | undefined;
	price: number;
	originalPrice: number | undefined;
	validUntil: string | undefined;
};

export type WeHelpItem = {
	id: number;
	title: string;
	description: string | undefined;
	photoId: string | undefined;
	photoAlt: string | undefined;
	link: string | undefined;
	featured: boolean;
};

export type SectionWeHelp = {
	title: string;
	items: WeHelpItem[];
	slider: SliderOptions;
	directusId: number | undefined;
	translationId: number | undefined;
};
