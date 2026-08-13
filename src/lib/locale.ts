import { locales, baseLocale, type Locale } from '$lib/paraglide/runtime';

/**
 * Resolves the active locale from a pathname alone.
 *
 * Replaces `getLocaleForUrl()` from the generated paraglide runtime: that function's
 * "url" strategy branch is gated behind `!isServer` (see resolveLocaleWithStrategies in
 * src/lib/paraglide/runtime.js), so during SSR/prerendering it always falls through to
 * baseLocale regardless of the URL passed in. For the base locale ("ru", no prefix) this
 * silently produces the right answer by coincidence; for any other locale it doesn't —
 * every non-base-locale page (e.g. /kk) rendered with an entirely empty layout/page,
 * because every reactive query in the component tree resolved its cache key under the
 * wrong locale. This is a plain pathname check instead, with no server/client split.
 */
export function localeFromPathname(pathname: string): Locale {
	for (const locale of locales) {
		if (locale === baseLocale) continue;
		if (pathname === `/${locale}` || pathname.startsWith(`/${locale}/`)) {
			return locale;
		}
	}
	return baseLocale;
}
