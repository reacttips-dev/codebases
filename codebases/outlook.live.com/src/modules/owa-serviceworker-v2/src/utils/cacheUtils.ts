import { isQuotaError } from './isOneOf';
import * as trace from './trace';

export function put(cache: Cache, request: RequestInfo, response: Response): Promise<boolean> {
    return cache.put(request, response).then(
        () => true,
        error => {
            trace.warn(
                `Error putting ${typeof request == 'string' ? request : request.url} in cache`,
                error
            );
            // QuotaExceededError is a expected error in which we want to handle so we will return false
            if (error?.name == 'QuotaExceededError' || isQuotaError(error?.message)) {
                return false;
            }

            // any other exceptions, we would like to still throw the error so we can log it
            throw error;
        }
    );
}

export function openCache(name: string): Promise<Cache | null> {
    if (!self.caches?.open || typeof self.caches.open != 'function') {
        trace.warn(`Could not open cache ${name}`);
        return Promise.resolve(null);
    }

    return self.caches.open(name);
}
