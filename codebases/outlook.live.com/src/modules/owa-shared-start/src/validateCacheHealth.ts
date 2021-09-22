import createBootError from './createBootError';
import { hasQueryStringParameter } from 'owa-querystring';
import type { SessionData } from 'owa-service/lib/types/SessionData';
import deleteAllCachedBuildsForApp from './deleteAllCachedBuildsForApp';
import type { ServiceWorkerSource } from 'owa-serviceworker-common/lib/types/ServiceWorkerSource';
import { appendMiscData } from './miscData';

export function validateCacheHealth(
    bootSettingsPromise: Promise<SessionData>,
    expirationDatePromise: Promise<number | null>,
    cachesToClean?: ServiceWorkerSource
): Promise<void> {
    // We don't need to validate the cache if there is a bO query string parameter
    // as the service worker will already skip the request
    if (hasQueryStringParameter('bO')) {
        return Promise.resolve();
    }

    return Promise.all([expirationDatePromise, bootSettingsPromise]).then(
        ([expirationDate, bootSettings]) => {
            // Check if the cached build has expired against server time to resolve cases where client time is incorrect
            if (
                typeof expirationDate == 'number' &&
                bootSettings?.currentEpochInMs &&
                bootSettings.currentEpochInMs > expirationDate
            ) {
                appendMiscData('ceim', bootSettings.currentEpochInMs);
                appendMiscData('expirationDate', expirationDate);
                if (cachesToClean) {
                    deleteAllCachedBuildsForApp(<string>cachesToClean);
                }
                throw createBootError(new Error('ExpiredBuild'), 'ExpiredBuild');
            }
        }
    );
}
