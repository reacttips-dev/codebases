import { LazyAction, LazyModule } from 'owa-bundling-light';

const lazyAnalytics = new LazyModule(
    () => import(/* webpackChunkName: "Analytics" */ './lazyIndex')
);

export let lazyInitializeAnalytics = new LazyAction(lazyAnalytics, m => m.initializeAnalytics);
export let lazyFlush = new LazyAction(lazyAnalytics, m => m.flush);
export let lazyLogDatapoint = new LazyAction(lazyAnalytics, m => m.logDatapoint);
export let lazyLogPerformanceDatapoint = new LazyAction(
    lazyAnalytics,
    m => m.logPerformanceDatapoint
);
export let lazyGetResourceTimingForUrl = new LazyAction(
    lazyAnalytics,
    m => m.getResourceTimingForUrl
);
export let lazyLogSigsDatapoint = new LazyAction(lazyAnalytics, m => m.logSigsDatapoint);
export let lazyLogCLPAriaDataPoint = new LazyAction(lazyAnalytics, m => m.logCLPAriaDataPoint);

export function lazyGetOTelAddinsLogger(tenantToken: string) {
    return lazyAnalytics.import().then(analytics => analytics.getOTelAddinsLogger(tenantToken));
}

export function lazyGetActionableMessageLogger() {
    return lazyAnalytics.import().then(analytics => analytics.getActionableMessageLogger());
}

export let lazyLogAddinsCustomerContent = new LazyAction(
    lazyAnalytics,
    m => m.logAddinsCustomerContent
);

export let lazyLogAddinsTelemetryEvent = new LazyAction(
    lazyAnalytics,
    m => m.logAddinsTelemetryEvent
);

export let lazyLogUsage = new LazyAction(lazyAnalytics, m => m.logUsage);
export let lazyTrackNetworkResponse = new LazyAction(lazyAnalytics, m => m.trackNetworkResponse);
