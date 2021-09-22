import type SWError from '../types/SWError';
import * as trace from './trace';

export function validateFetch(response: Response, message: string): Response {
    if (!response.ok) {
        trace.warn(`Fetch failed for ${response.url}: m=${message},s=${response.status}`);
        const error: SWError = new Error(message);
        error.status = response.status;
        error.resource = response.url;
        throw error;
    }
    return response;
}

export async function validateBlob(response: Response): Promise<Response> {
    // we clone the response to avoid altering the internal flag response.bodyUsed
    const blob = await response.clone().blob();
    if (blob.size === 0) {
        trace.warn(`Blob failed for ${response.url}`);
        const error: SWError = new Error('BlobZeroLength');
        error.resource = response.url;
        throw error;
    }
    return response;
}
