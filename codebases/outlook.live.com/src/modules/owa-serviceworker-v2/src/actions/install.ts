import * as trace from '../utils/trace';
import { ClientMessage, CacheStatus } from 'owa-serviceworker-common';
import fetchManifest from '../utils/fetchManifest';
import fetchAndCacheResource from '../utils/fetchAndCacheResource';
import { getCacheWrapper, updateCacheWrapper, getCacheWrapperSync } from '../cacheWrapperMap';
import type CacheWrapper from '../types/CacheWrapper';
import { handleCacheMessage } from '../utils/eventSubscriber';
import cleanupOldCaches from '../utils/cleanupOldCaches';
import { flush } from '../analytics/logDatapoint';
import { createPerfDatapoint, DatapointStatus } from '../analytics/createPerfDatapoint';
import type SWError from '../types/SWError';
import { openCache } from '../utils/cacheUtils';
import { isNetworkError, isQuotaError } from '../utils/isOneOf';

export default async function install(message: ClientMessage) {
    const endGroupTrace = trace.group('InstallCache');
    const source = message.source;
    const hadCachesAlreadyInstalled = await cleanupOldCaches();
    const dp = createPerfDatapoint('SwInstall', source);
    let status: DatapointStatus = 'Success';
    let result = 'Unknown';
    let error: Error | undefined = undefined;
    let resource: string | undefined = undefined;
    try {
        const currentCacheWrapper = await getCacheWrapper(source);
        const currentVersion: string = currentCacheWrapper?.version || 'NA';
        trace.log(`Current installed verison: ${currentVersion}`);
        dp.addData('current', currentVersion);
        const manifest = await fetchManifest(message, 0);
        const manifestVersion = manifest?.cacheVersion || 'NA';
        trace.log(`Manifest version: ${manifestVersion}`);
        dp.addData('next', manifestVersion);
        if (currentCacheWrapper && currentCacheWrapper.version === manifest.cacheVersion) {
            result = 'NoUpdate';
        } else {
            const manifestDateTime = new Date(manifest.date).getTime();
            const name = `${source}_${manifest.cacheVersion}_${manifestDateTime}`;
            const cache = await openCache(name);
            if (cache) {
                const newCacheWrapper: CacheWrapper = {
                    name,
                    scope: source,
                    version: manifest.cacheVersion,
                    requestMap: {},
                    cache,
                };

                const cachePromises = manifest.dynamicFiles
                    .map(s => fetchAndCacheResource(newCacheWrapper, s, true, message, 0))
                    .concat(
                        manifest.staticFiles.map(s =>
                            fetchAndCacheResource(newCacheWrapper, s, false, message, 0)
                        )
                    );

                // wait for all the resources to be cached
                await Promise.all(cachePromises);
                result = hadCachesAlreadyInstalled ? 'UpdateReady' : 'Cached';
                const success = await updateCacheWrapper(source, newCacheWrapper);
                if (success) {
                    resource = manifestDateTime.toString();
                } else {
                    result = 'NoQuota';
                }
            } else {
                result = 'NoCache';
            }
        }
    } catch (e) {
        result = getCacheWrapperSync(source) ? 'Idle' : 'Uncached';
        status = calculateStatus(e);
        error = e;
    } finally {
        trace.log(`Status=${status},Result=${result},Resource=${resource}`, error);
        handleCacheMessage(source, {
            status: status == 'Success' ? CacheStatus.CacheInstalled : CacheStatus.CacheFailed,
            resource,
        });
        endGroupTrace();
        dp.addData('Result', result);
        await dp.end(status, error);
        await flush();
    }
}

function calculateStatus(e: SWError): DatapointStatus {
    if (isNetworkError(e.message) || isQuotaError(e.message)) {
        return 'UserError';
    }
    if (e.resource) {
        // if we don't have a status then it was probably a network problem which
        // we will classify as a user error
        return e.status ? 'ServerError' : 'UserError';
    }

    return 'ClientError';
}
