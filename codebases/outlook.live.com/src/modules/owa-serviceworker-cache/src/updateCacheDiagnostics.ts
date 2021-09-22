import { CacheStatus, ServiceWorkerSource } from 'owa-serviceworker-common';
import { setConsecutiveErrorCount, getConsecutiveErrorCount } from './consecutiveErrorCount';

export default function updateCacheDiagnostics(
    appName: ServiceWorkerSource,
    cacheStatus: CacheStatus
): void {
    setConsecutiveErrorCount(
        appName,
        cacheStatus == CacheStatus.CacheFailed ? getConsecutiveErrorCount(appName) + 1 : 0
    );
}
