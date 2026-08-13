import { createEnv } from '@t3-oss/env-core';
import { z } from 'zod';
import * as privateEnv from '$env/static/private';

export const env = createEnv({
	server: {
		DIRECTUS_URL: z.url(),
		DIRECTUS_TOKEN: z.string().min(1),
		// Optional on purpose: forms work without it (verifyCaptcha no-ops until this is set).
		HCAPTCHA_SECRET_KEY: z.string().min(1).optional()
	},
	runtimeEnv: { ...privateEnv },
	emptyStringAsUndefined: true
});
