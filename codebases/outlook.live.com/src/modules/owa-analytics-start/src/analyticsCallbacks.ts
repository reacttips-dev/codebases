import { registerTracerListener, TraceLevel, TraceErrorObject } from 'owa-trace';
import isPerformanceTimingSupported from './isPerformanceTimingSupported';
import type {
    CustomData,
    DatapointOptions,
    LogUsageFunction,
    ServiceResponseCallback,
} from 'owa-analytics-types';

export interface CachedTrace {
    message: string;
    level: TraceLevel;
}

export interface CachedError {
    message: string;
    error: TraceErrorObject | undefined;
}

export interface StartUsage {
    name: string;
    customData?: CustomData;
}

const defaultResourceTimingBufferSize: number = 500;
const cachedTraces: CachedTrace[] = [];
const cachedErrorDetails: CachedError[] = [];
const cachedNetworkRequests: any[] = [];
const cachedStartUsage: StartUsage[] = [];

let logUsageFunction: LogUsageFunction | undefined;

let shouldCache = true;

export function addAnalyticsCallbacks(
    registerOwsCreateServiceResponseCallback: (cb: ServiceResponseCallback) => void,
    registerOwsPrimeCreateServiceResponseCallback: (cb: ServiceResponseCallback) => void
) {
    registerTracerListener((message, level, error) => {
        if (shouldCache) {
            if (level == TraceLevel.Error) {
                cachedErrorDetails.push({ message, error });
            }
            cachedTraces.push({ message, level });
        }
    });
    registerOwsCreateServiceResponseCallback(trackServiceRequest);
    registerOwsPrimeCreateServiceResponseCallback(trackServiceRequest);
    if (isPerformanceTimingSupported()) {
        if (window.performance.setResourceTimingBufferSize) {
            window.performance.setResourceTimingBufferSize(defaultResourceTimingBufferSize);
        } else if (window.performance.webkitSetResourceTimingBufferSize) {
            window.performance.webkitSetResourceTimingBufferSize(defaultResourceTimingBufferSize);
        }
    }
}

export function logStartUsage(name: string, customData?: CustomData, options?: DatapointOptions) {
    if (logUsageFunction) {
        logUsageFunction(name, customData, options);
    } else {
        cachedStartUsage.push({ name, customData });
    }
}

export function getCachedInfo(logUsageFunc: LogUsageFunction) {
    logUsageFunction = logUsageFunc;
    shouldCache = false;
    return {
        traces: cachedTraces,
        errors: cachedErrorDetails,
        network: cachedNetworkRequests,
        usage: cachedStartUsage,
    };
}

function trackServiceRequest() {
    if (shouldCache) {
        cachedNetworkRequests.push(arguments);
    }
}

interface IPerformance {
    webkitSetResourceTimingBufferSize: any;
    webkitClearResourceTimings: any;
}

declare global {
    // tslint:disable-next-line:no-empty-interface
    interface Performance extends IPerformance {}
}
