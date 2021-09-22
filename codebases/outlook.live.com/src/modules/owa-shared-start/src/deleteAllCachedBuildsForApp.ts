import { getCacheKeys } from './utils/cacheStorageUtils';
import { appendMiscData } from './miscData';

export default function deleteAllCachedBuildsForApp(prefix: string) {
    const keysPromise = getCacheKeys();
    if (!keysPromise) {
        return Promise.resolve(null);
    }

    return keysPromise.then(keys => {
        appendMiscData('delCaches', keys.join('|'));
        return Promise.all(
            keys.filter(k => k.indexOf(prefix) == 0).map(k => self.caches.delete(k))
        ).catch(() => {});
    });
}
