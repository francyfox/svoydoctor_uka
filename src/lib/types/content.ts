export type Settings = {
	siteName: string;
	phone: string;
	logoId: string | undefined;
	address: string | undefined;
	hoursWeekday: string | undefined;
	hoursSaturday: string | undefined;
	offDays: number[];
	ratingValue: string | undefined;
	ratingLabel: string | undefined;
	reviewsUrl: string | undefined;
	mapEmbedUrl: string | undefined;
	clinicPhotoId: string | undefined;
	directusId: number | undefined;
	translationId: number | undefined;
};

export type HeroBackgroundMedia = {
	id: string;
	kind: 'image' | 'video';
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
	iconId: string | undefined;
};

export type SectionHero = {
	blocks: HeroBlock[];
	advantages: HeroAdvantage[];
	directusId: number | undefined;
	translationId: number | undefined;
};

export type ServiceItem = {
	id: number;
	label: string;
	description: string | undefined;
	illustrationId: string | undefined;
	ctaLabel: string;
};

export type SectionServices = {
	items: ServiceItem[];
	directusId: number | undefined;
	translationId: number | undefined;
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
	directusId: number | undefined;
	translationId: number | undefined;
};

export type WeHelpItem = {
	id: number;
	title: string;
	description: string | undefined;
	photoId: string | undefined;
	link: string | undefined;
};

export type SectionWeHelp = {
	title: string;
	items: WeHelpItem[];
	directusId: number | undefined;
	translationId: number | undefined;
};
