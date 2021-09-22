export function getCacheKeys(): Promise<string[]> | null {
    try {
        if ('caches' in self && typeof self.caches.keys == 'function') {
            const promise = self.caches.keys();
            if (promise && typeof promise.then == 'function') {
                return promise.catch(() => []);
            }
        }
    } catch {} // Firefox will throw an exception if caches is not supproted
    return null;
}
