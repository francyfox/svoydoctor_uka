import { keepPreviousData } from '@tanstack/svelte-query';
import type { FormCollection, FormFieldSchema } from '$lib/types/content';
import { localizeHref } from '$lib/paraglide/runtime';

export function formSchemaQueryKey(collection: FormCollection) {
	return ['form-schema', collection] as const;
}

export function formSchemaQueryOptions(collection: FormCollection, fetchFn: typeof fetch = fetch) {
	return {
		queryKey: formSchemaQueryKey(collection),
		queryFn: async (): Promise<FormFieldSchema[]> => {
			const response = await fetchFn(localizeHref(`/api/forms/${collection}`));
			return response.json();
		},
		placeholderData: keepPreviousData
	};
}
