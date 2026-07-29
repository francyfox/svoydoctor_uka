import * as m from '$lib/paraglide/messages.js';

/** Static nav config — labels are message function refs, called reactively at render time. */
export const navItems = [
	{ path: '/', label: m.nav_home },
	{ path: '/services', label: m.nav_services },
	{ path: '/about', label: m.nav_about },
	{ path: '/we-help', label: m.nav_we_help },
	{ path: '/contacts', label: m.nav_contacts }
];
