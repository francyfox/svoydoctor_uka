export type Settings = {
	siteName: string;
	phone: string;
	logoUrl: string | undefined;
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
