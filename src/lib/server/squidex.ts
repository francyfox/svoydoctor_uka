import { SquidexClient } from '@squidex/squidex';
import { env } from '$lib/server/env';
import type { Settings, HeroBlock, HeroAdvantage, SectionHero } from '$lib/types/content';

export type { Settings, HeroBlock, HeroAdvantage, SectionHero };

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

function assetUrl(asset: SquidexAsset | undefined): string | undefined {
	const id = asset?.[0];
	return id ? `${env.SQUIDEX_URL}/api/assets/${env.SQUIDEX_APP}/${id}` : undefined;
}

export async function getSettings(): Promise<Settings> {
	const result = await client.contents.getContents('settings', {});
	const item = result.items[0];
	const data = item.data as SettingsData;

	return {
		siteName: data.siteName.iv,
		phone: data.phone.iv,
		logoUrl: assetUrl(data.logo.iv),
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
