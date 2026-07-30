export type Settings = {
	siteName: string;
	phone: string;
	logoUrl: string | undefined;
	address: string | undefined;
	hoursWeekday: string | undefined;
	hoursSaturday: string | undefined;
	offDays: number[];
	ratingValue: string | undefined;
	ratingLabel: string | undefined;
	reviewsUrl: string | undefined;
	mapEmbedUrl: string | undefined;
	clinicPhotoUrl: string | undefined;
	editToken: string | undefined;
};

export type HeroBlock = {
	title: string;
	description: string | undefined;
	link: string | undefined;
	backgroundImageUrl: string | undefined;
};

export type HeroAdvantage = {
	text: string;
	iconUrl: string | undefined;
};

export type SectionHero = {
	blocks: HeroBlock[];
	advantages: HeroAdvantage[];
	editToken: string | undefined;
};

export type ServiceItem = {
	label: string;
	description: string | undefined;
	illustrationUrl: string | undefined;
	ctaLabel: string;
};

export type SectionServices = {
	items: ServiceItem[];
	editToken: string | undefined;
};

export type SymptomSpecies = 'cat' | 'dog' | 'both';

export type SymptomItem = {
	text: string;
	species: SymptomSpecies;
};

export type SectionSymptoms = {
	title: string;
	subtitle: string | undefined;
	symptoms: SymptomItem[];
	editToken: string | undefined;
};

export type WeHelpItem = {
	title: string;
	description: string | undefined;
	photoUrl: string | undefined;
	link: string | undefined;
};

export type SectionWeHelp = {
	title: string;
	items: WeHelpItem[];
	editToken: string | undefined;
};
