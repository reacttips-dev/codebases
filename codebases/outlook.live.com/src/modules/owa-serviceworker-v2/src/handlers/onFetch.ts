import handleResponse from '../utils/handleResponse';
import { getCachedRequestMatch } from '../cacheWrapperMap';
import handleGetResourceFetch from '../utils/handleGetResourceFetch';
import * as trace from '../utils/trace';

declare var self: ServiceWorkerGlobalScope;

const resourcesRegex: RegExp = new RegExp(/\.(js|eot|ttf|woff|aspx|css|png|gif|ico|svg|jpeg)/i);
const localProxyRegex: RegExp = new RegExp(/^\w+:\/\/[\w.-]*\/local/i);
let offlinePageServed = false;

export function onFetch(e: FetchEvent) {
    // Only allow GET and https calls to be processed by SW
    if (e.request.method !== 'GET' || e.request.url.indexOf('https') !== 0) {
        return;
    }

    // Skip SW for native host hijack calls since SW processing interferes with the hijacking
    if (localProxyRegex.test(e.request.url)) {
        trace.log(`Skipping resource because it will be handled by local proxy: ${e.request.url}`);
        return;
    }

    // we should only be caching the navigate or resources
    if (e.request.mode != 'navigate' && !resourcesRegex.test(e.request.url)) {
        return;
    }

    // If there is a request that fails to fetch, we want to pass that error along to the client
    // but we don't want it to result in an unhandled rejection error so we will also catch the error
    e.respondWith(
        handleGetResourceFetch(e)
            .then(response => handleResponse(e, response))
            .catch(e => {
                trace.warn(`Resource failed ${e.request.url}`, e);
                return self.fetch(e.request);
            })
            .catch(() => {
                if (e.request.mode == 'navigate') {
                    const request = getCachedRequestMatch('offline_index_');
                    if (request) {
                        trace.log(`Returning offline page for ${e.request.url}`);

                        // In chromium 89, there is a new feature that will try to detect if a website
                        // can support offline mode. This is done by calling another fetch request
                        // with request mode 'navigate' that will intentionally fail. This will put our
                        // service worker in a state where it will think it is offline and will force
                        // all the clients to refresh when the connection changes. This leads to
                        // the clients refreshing at random intervals
                        // Until we figure out a way to differentiate between this fetch and a normal
                        // navigate fetch, I am going to disable this feature. This WI is tracking when
                        // we can renable it OW WI 109824
                        // offlinePageServed = true;
                        return self.caches.match(request) as Promise<any>;
                    }
                }
                return undefined;
            })
    );
}

const connection = (<any>self.navigator)?.connection;
if (connection) {
    connection.onchange = () => {
        if (self.navigator.onLine && offlinePageServed) {
            trace.log('Refreshing all clients');
            self.clients.matchAll().then(clients => {
                for (let i = 0; i < clients.length; ++i) {
                    try {
                        (<any>clients[i]).navigate('.');
                    } catch {
                        // do nothing
                    }
                }
            });
        }
        offlinePageServed = false;
    };
}
