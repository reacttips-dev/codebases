import type { ServiceWorkerSource } from 'owa-serviceworker-common/lib/types/ServiceWorkerSource';
import { getCacheWrapper } from '../cacheWrapperMap';
import { logError } from '../analytics/logDatapoint';
import * as trace from './trace';

export default async function cleanupOldCaches(): Promise<boolean> {
    try {
        const cacheNames = await self.caches.keys();
        const namesBySource = cacheNames.reduce((agg, x) => {
            const source = x.split('_')[0];
            agg[source] = agg[source] || [];
            agg[source].push(x);
            return agg;
        }, {});

        delete namesBySource['root'];
        delete namesBySource['shelluxlog'];
        const cacheKeys = Object.keys(namesBySource);
        await combineAnd(
            cacheKeys.map(source =>
                cleanupSource(source as ServiceWorkerSource, namesBySource[source])
            )
        );
        return cacheKeys.length > 0;
    } catch (e) {
        trace.warn('Error cleaning up caches', e);
        logError(e, 'cleanupOldCaches');
        return false;
    }
}

async function cleanupSource(source: ServiceWorkerSource, cacheNames: string[]): Promise<boolean> {
    const wrapper = await getCacheWrapper(source);
    if (wrapper) {
        // we don't want to delete the active cache
        cacheNames = cacheNames.filter(name => name != wrapper.name);
    }
    return combineAnd(
        cacheNames.map(name => {
            trace.log(`Cleaning up cache ${name}`);
            return self.caches.delete(name);
        })
    );
}

function combineAnd(promises: Promise<boolean>[]): Promise<boolean> {
    return Promise.all(promises).then(suceededArr =>
        suceededArr.reduce((agg, x) => agg && x, true)
    );
}
