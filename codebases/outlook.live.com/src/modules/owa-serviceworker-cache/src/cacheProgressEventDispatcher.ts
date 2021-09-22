import {
    CacheEventType,
    CacheMessage,
    ServiceWorkerMessage,
    CacheStatus,
} from 'owa-serviceworker-common';
import type CacheInstallationState from './interfaces/CacheInstallationState';
import { trace } from 'owa-trace';
import logServiceWorkerOptics from './logServiceWorkerOptics';
import updateCacheDiagnostics from './updateCacheDiagnostics';
import { installServiceWorkerCache } from './installServiceWorkerCache';
import CacheHealth from './interfaces/CacheHealth';

export default function cacheProgressEventDispatcher(
    state: CacheInstallationState,
    message: ServiceWorkerMessage
): void {
    if (
        message.cacheMessage &&
        (message.targetClient == state.appName || message.targetClient == 'global')
    ) {
        let cacheMessage: CacheMessage = message.cacheMessage;
        trace.info('[SW Client] Cache Event: ' + cacheMessage.cacheEvent);
        let cacheStatus: CacheStatus | null = null;
        switch (cacheMessage.cacheEvent) {
            case CacheEventType.Progress:
                state.resourcesCached++;
                break;
            case CacheEventType.Error:
                cacheStatus = CacheStatus.CacheFailed;
                break;
            case CacheEventType.Cached:
            case CacheEventType.NoUpdate:
            case CacheEventType.UpdateReady:
                cacheStatus = CacheStatus.CacheInstalled;
                break;
            case CacheEventType.Obsolete:
                cacheStatus = CacheStatus.CacheCleared;
                break;
            case CacheEventType.CleanupError:
                state.cacheCleanupStatus = 1;
                break;
            case CacheEventType.CleanupSuceeded:
                state.cacheCleanupStatus = 2;
                state.numberOfCachesCleaned = cacheMessage.cachesCleaned
                    ? cacheMessage.cachesCleaned.length
                    : 0;
                break;
        }

        const isObsoleteEvent = cacheMessage.cacheEvent == CacheEventType.Obsolete;
        if (cacheStatus != null) {
            updateCacheDiagnostics(state.appName, cacheStatus);
            logServiceWorkerOptics(state, cacheMessage);
        }

        // Re-attempt to install the cache after cleaning the old caches
        if (isObsoleteEvent && state.cacheHealth > CacheHealth.Normal) {
            state.cacheHealth = CacheHealth.Normal;
            installServiceWorkerCache();
        }
    }
}
