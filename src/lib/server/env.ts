import { createEnv } from '@t3-oss/env-core';
import { z } from 'zod';
import * as privateEnv from '$env/static/private';

export const env = createEnv({
	server: {
		DIRECTUS_URL: z.url(),
		DIRECTUS_TOKEN: z.string().min(1)
	},
	runtimeEnv: { ...privateEnv },
	emptyStringAsUndefined: true
});
