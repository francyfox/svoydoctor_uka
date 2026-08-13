import { handleFormSchemaRequest } from '$lib/server/forms';
import type { RequestHandler } from './$types';

export const prerender = true;

export const GET: RequestHandler = () => handleFormSchemaRequest('booking_requests');
