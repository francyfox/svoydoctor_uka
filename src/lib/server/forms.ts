import { error, json } from '@sveltejs/kit';
import { getFormSchema, createFormSubmission } from '$lib/server/directus';
import { verifyCaptcha } from '$lib/server/captcha';
import type { FormCollection } from '$lib/types/content';

// Route files for each of the two known collections delegate here — kept as two static
// directories (not a /[collection]/ dynamic segment) specifically so adapter-vercel can
// prerender the GET schema route as a plain static file; a dynamic segment shared with the
// non-prerenderable submit/+server.ts sibling made the adapter drop the static output
// entirely and fall back to serving it from the SSR function instead.
export async function handleFormSchemaRequest(collection: FormCollection) {
	return json(await getFormSchema(collection));
}

export async function handleFormSubmitRequest(collection: FormCollection, request: Request) {
	const body = await request.json();
	const { captchaToken, ...values } = body as { captchaToken?: string; [key: string]: unknown };

	if (!(await verifyCaptcha(captchaToken ?? null))) {
		error(403, 'Failed captcha verification');
	}

	const schema = await getFormSchema(collection);
	const data: Record<string, string> = {};

	for (const field of schema) {
		const value = values[field.field];
		if (field.required && (typeof value !== 'string' || value.trim() === '')) {
			error(400, `Missing required field: ${field.field}`);
		}
		if (typeof value === 'string' && value !== '') {
			data[field.field] = value;
		}
	}

	await createFormSubmission(collection, data);

	return json({ ok: true });
}
