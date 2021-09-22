import {
    ServiceWorkerMessageType,
    CacheMessage,
    ServiceWorkerSource,
} from 'owa-serviceworker-common';
import * as trace from './trace';

declare var self: ServiceWorkerGlobalScope;

export function handleCacheMessage(source: ServiceWorkerSource, cacheMessage: CacheMessage) {
    self.clients.matchAll().then(clients => {
        if (clients) {
            for (let i = 0; i < clients.length; ++i) {
                try {
                    const message = {
                        targetClient: source,
                        messageType: ServiceWorkerMessageType.OnCacheInstall,
                        cacheMessage,
                    };
                    trace.log('Sending message to clients', message);
                    clients[i].postMessage(message);
                } catch (error) {
                    trace.warn('[SW] Error while postMessage to clients', error);
                }
            }
        }
    });
}
