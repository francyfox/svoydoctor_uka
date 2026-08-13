import { env } from '$lib/server/env';

const VERIFY_URL = 'https://hcaptcha.com/siteverify';

/**
 * No-ops (returns true) until HCAPTCHA_SECRET_KEY is set — lets form submission work
 * end-to-end before the secret key is added. The public site key already renders a real
 * widget client-side; this is only the server-side half of verification.
 */
export async function verifyCaptcha(token: string | null): Promise<boolean> {
	if (!env.HCAPTCHA_SECRET_KEY) return true;
	if (!token) return false;

	const response = await fetch(VERIFY_URL, {
		method: 'POST',
		headers: { 'content-type': 'application/x-www-form-urlencoded' },
		body: new URLSearchParams({ secret: env.HCAPTCHA_SECRET_KEY, response: token })
	});
	const result = (await response.json()) as { success: boolean };
	return result.success === true;
}
