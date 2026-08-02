import type { Handle } from '@sveltejs/kit';
import { getTextDirection } from '$lib/paraglide/runtime';
import { paraglideMiddleware } from '$lib/paraglide/server';

// Most routes are prerendered (SSG), so this hook never runs for them at request time —
// the Content-Security-Policy header allowing the Directus Visual Editor iframe lives in
// vercel.json instead, since that applies to static output too.
const paraglideHandle: Handle = ({ event, resolve }) =>
	paraglideMiddleware(event.request, ({ request: localizedRequest, locale }) => {
		event.request = localizedRequest;
		return resolve(event, {
			transformPageChunk: ({ html }) => {
				return html
					.replace('%lang%', locale)
					.replace('%dir%', getTextDirection(locale));
			}
		});
	});

export const handle: Handle = paraglideHandle;
