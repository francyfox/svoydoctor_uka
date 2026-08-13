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

export type HeroBlock = {
	id: number;
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

export type PageSection = {
	key: string;
	visible: boolean;
	shader: string;
};

export type SliderOptions = {
	autoplay: boolean;
	speed: number;
	interval: number;
};

export type PageMetaKey = 'home' | 'services' | 'apply' | 'about' | 'we_help' | 'contacts' | 'privacy';

export type PageMeta = {
	title: string;
	description: string | undefined;
	ogImageId: string | undefined;
	noindex: boolean;
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
