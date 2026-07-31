import { browser } from '$app/environment';
import { QueryClient } from '@tanstack/svelte-query';

function createQueryClient(): QueryClient {
	return new QueryClient({
		defaultOptions: {
			queries: {
				staleTime: 10 * 60 * 1000
			}
		}
	});
}

let browserQueryClient: QueryClient | undefined;

/** Fresh client per SSR request on the server; one reused singleton in the browser. */
export function getQueryClient(): QueryClient {
	if (!browser) return createQueryClient();
	if (!browserQueryClient) browserQueryClient = createQueryClient();
	return browserQueryClient;
}
