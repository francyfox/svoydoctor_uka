import type { Locale as _Locale } from '$lib/paraglide/runtime';
import { browser } from '$app/environment';
import { goto } from '$app/navigation';
import { page } from '$app/state';
import { localeFromPathname } from '$lib/locale';

import {
	baseLocale,
	localizeUrl,
	overwriteGetLocale,
	overwriteSetLocale,
	toLocale
} from '$lib/paraglide/runtime';

export class Locale {
	#current: _Locale = $state(toLocale(browser && document.querySelector('html')?.lang) ?? baseLocale);

	constructor() {
		overwriteGetLocale(() => this.#current);

		overwriteSetLocale((locale) => {
			this.#current = locale;
			goto(localizeUrl(page.url.pathname, { locale }).href);
		});

		// #current only tracked explicit setLocale() calls — a plain <a href> to a
		// localized URL (e.g. the header's language switcher) never called setLocale(),
		// so getLocale() (and every m.*() message call) stayed stuck on whatever locale
		// the app first booted with. This keeps #current synced with the actual URL on
		// every navigation, not just ones that happen to go through setLocale().
		if (browser) {
			$effect.root(() => {
				$effect(() => {
					this.#current = localeFromPathname(page.url.pathname);
				});
			});
		}
	}
}
