import type { CacheMessage } from './CacheMessage';
import type { ServiceWorkerSource } from './ServiceWorkerSource';

// The shape of service worker message
export interface ServiceWorkerMessage {
    targetClient: ServiceWorkerSource | 'global';
    messageType: ServiceWorkerMessageType;
    cacheMessage?: CacheMessage;
    error?: any;
}

// The service worker message type
export enum ServiceWorkerMessageType {
    CacheProgress = 0,
    Error = 1,
    OnCacheInstall = 2,
}
