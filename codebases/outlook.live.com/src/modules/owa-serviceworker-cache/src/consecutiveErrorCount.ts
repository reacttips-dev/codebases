import { setItem, getItem, removeItem } from 'owa-local-storage';
import getKeyName from './getKeyName';
import type { ServiceWorkerSource } from 'owa-serviceworker-common/lib/types/ServiceWorkerSource';

const ERROR_COUNT_KEY: string = 'SWCacheErrorCount';

export function setConsecutiveErrorCount(appName: ServiceWorkerSource, count: number): void {
    let keyName = getKeyName(appName, ERROR_COUNT_KEY);
    if (count == 0) {
        removeItem(window, keyName);
    } else {
        setItem(window, keyName, '' + count);
    }
}

export function getConsecutiveErrorCount(appName: ServiceWorkerSource): number {
    let errorCount = parseInt(getItem(window, getKeyName(appName, ERROR_COUNT_KEY)));
    return isNaN(errorCount) ? 0 : errorCount;
}
