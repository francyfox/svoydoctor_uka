import Menu from '@lucide/svelte/icons/menu';
import Microscope from '@lucide/svelte/icons/microscope';
import ShieldCheck from '@lucide/svelte/icons/shield-check';
import Star from '@lucide/svelte/icons/star';
import SiWhatsapp from '@icons-pack/svelte-simple-icons/icons/SiWhatsapp';
import SiInstagram from '@icons-pack/svelte-simple-icons/icons/SiInstagram';
import SiTelegram from '@icons-pack/svelte-simple-icons/icons/SiTelegram';

/**
 * Curated name -> component registry. Keep this list explicit (no wildcard
 * re-export of the full simple-icons/lucide sets) so only icons actually used
 * end up in the bundle. Extend when a new icon is needed — e.g. once Squidex
 * content editors can pick an icon by name for advantages/social links.
 */
export const iconRegistry = {
	menu: Menu,
	microscope: Microscope,
	'shield-check': ShieldCheck,
	star: Star,
	whatsapp: SiWhatsapp,
	instagram: SiInstagram,
	telegram: SiTelegram
};

export type IconName = keyof typeof iconRegistry;
