export {
    lazyInitializeAnalytics,
    lazyFlush,
    lazyGetResourceTimingForUrl,
    lazyLogSigsDatapoint,
    lazyLogCLPAriaDataPoint,
    lazyLogDatapoint,
    lazyGetOTelAddinsLogger,
    lazyGetActionableMessageLogger,
    lazyLogAddinsCustomerContent,
    lazyLogAddinsTelemetryEvent,
} from './lazyFunctions';
export { DatapointVariant } from 'owa-analytics-types';
export { DatapointStatus } from './types/DatapointEnums';
export type { AnalyticsOptions } from './types/DatapointEnums';
export type { default as CalculatedResourceTimings } from './types/CalculatedResourceTimings';
export { AriaDatapoint } from './datapoints/AriaDatapoint';
export { PerformanceDatapoint } from './datapoints/PerformanceDatapoint';
export { default as VerboseDatapoint } from './datapoints/VerboseDatapoint';
export {
    addDatapointMiddleware,
    returnTopExecutingActionDatapoint,
    wrapFunctionForDatapoint,
} from './DatapointMiddleware';
export { logUsage } from './api/logUsage';
export { logVerboseUsage } from './api/logVerboseUsage';
export { default as getMailAriaTenantTokens } from './utils/getMailAriaTenantTokens';
export { getServerErrorName } from './utils/getServerErrorName';
