import Menu from '@lucide/svelte/icons/menu';
import SiWhatsapp from '@icons-pack/svelte-simple-icons/icons/SiWhatsapp';
import SiInstagram from '@icons-pack/svelte-simple-icons/icons/SiInstagram';

/**
 * Curated name -> component registry. Keep this list explicit (no wildcard
 * re-export of the full simple-icons/lucide sets) so only icons actually used
 * end up in the bundle. Directus-driven icons (hero advantages, social links)
 * go through @iconify/svelte instead — this registry is only for icons that
 * are fixed in application code, not editable via the CMS.
 */
export const iconRegistry = {
	menu: Menu,
	whatsapp: SiWhatsapp,
	instagram: SiInstagram
};

export type IconName = keyof typeof iconRegistry;
