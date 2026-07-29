import { createEnv } from '@t3-oss/env-core';
import { z } from 'zod';
import * as privateEnv from '$env/static/private';

export const env = createEnv({
	server: {
		SQUIDEX_URL: z.url(),
		SQUIDEX_APP: z.string().min(1),
		SQUIDEX_CLIENT_ID: z.string().min(1),
		SQUIDEX_CLIENT_SECRET: z.string().min(1)
	},
	runtimeEnv: { ...privateEnv },
	emptyStringAsUndefined: true
});
