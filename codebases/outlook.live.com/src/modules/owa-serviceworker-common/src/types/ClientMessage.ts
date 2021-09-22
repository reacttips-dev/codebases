import type { ServiceWorkerSource } from './ServiceWorkerSource';

// The actions that can be performed by cachemanager
export enum Action {
    Install = 0,
    UnInstall = 1,
    Tracing = 2,
}

export enum CachePriorityStrategy {
    Updates = 'Updates', // Thiw will prioritize updating between builds instead of downloading all of the resources
    Resources = 'Resources', // this will priorititize that all the resources are downloaded successfully
}

export enum SWTracing {
    None = '0',
    Logging = '1',
    Telemetry = '2',
    All = '3',
}

export interface ClientMessage {
    action: Action;
    source: ServiceWorkerSource;
    language?: string;
    manifestUrl: string;
    proxyFetchAlways?: boolean;
    rootUrl: string;
    tracingEnabled?: SWTracing;
    dynamicRequestHeaders?: { [key: string]: string };
    dynamicQueryString?: string;
    expectedXAppNameHeader?: string;
    priorityStrategy?: CachePriorityStrategy;
    clientId?: string;
    windowHeight?: number;
    readingPanePosition?: number;
    hxVersion?: string;
}
