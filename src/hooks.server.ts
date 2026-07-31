import type { Handle } from '@sveltejs/kit';
import { getTextDirection } from '$lib/paraglide/runtime';
import { paraglideMiddleware } from '$lib/paraglide/server';
import { env } from '$lib/server/env';

const paraglideHandle: Handle = ({ event, resolve }) =>
	paraglideMiddleware(event.request, async ({ request: localizedRequest, locale }) => {
		event.request = localizedRequest;
		const response = await resolve(event, {
			transformPageChunk: ({ html }) => {
				return html
					.replace('%lang%', locale)
					.replace('%dir%', getTextDirection(locale));
			}
		});

		// Allows the Directus Visual Editor to embed the site in an iframe for click-to-edit.
		response.headers.append('Content-Security-Policy', `frame-ancestors 'self' ${env.DIRECTUS_URL}`);

		return response;
	});

export const handle: Handle = paraglideHandle;
