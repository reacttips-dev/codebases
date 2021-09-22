import type CacheInstallationState from './interfaces/CacheInstallationState';
import { logUsage } from 'owa-analytics';
import { CacheEventType, CacheMessage } from 'owa-serviceworker-common';

const CacheEventMapping = {
    [CacheEventType.Error]: 'ER',
    [CacheEventType.Cached]: 'C',
    [CacheEventType.NoUpdate]: 'NU',
    [CacheEventType.Obsolete]: 'OB',
    [CacheEventType.UpdateReady]: 'UR',
};

export default function logServiceWorkerOptics(
    state: CacheInstallationState,
    message: CacheMessage
) {
    logUsage('SWCache', {
        ev: CacheEventMapping[message.cacheEvent],
        cv: message.cacheVersion,
        e: message.error,
        r: message.resource,
        st: message.status,
        stk: message.stack,
        rc: state.resourcesCached,
        ccs: state.cacheCleanupStatus,
        ncc: state.numberOfCachesCleaned,
        ch: state.cacheHealth,
        app: state.appName,
    });

    // reset per install tracking events
    state.resourcesCached = 0;
    state.cacheCleanupStatus = 0;
    state.numberOfCachesCleaned = 0;
}
