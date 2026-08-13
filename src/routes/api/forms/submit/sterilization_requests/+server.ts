import { handleFormSubmitRequest } from '$lib/server/forms';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = ({ request }) =>
	handleFormSubmitRequest('sterilization_requests', request);
