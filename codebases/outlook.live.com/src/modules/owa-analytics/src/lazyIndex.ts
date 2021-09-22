import { ariaFlush, getLogger } from './AriaWrapper';
import { oneDSFlush } from './OneDsWrapper';
import type { DatapointOptions, CustomData } from 'owa-analytics-types';
import UsageDatapoint from './datapoints/UsageDatapoint';
import logDatapoint from './logDatapoint';

export function logUsage(eventName: string, customData?: CustomData, options?: DatapointOptions) {
    logDatapoint(new UsageDatapoint(eventName, customData, options));
}

export function getOTelAddinsLogger(tenantToken: string) {
    return getLogger(tenantToken);
}

export function flush(): void {
    ariaFlush();
    oneDSFlush();
}

export { logDatapoint };
export { default as logSigsDatapoint } from './logSigsDatapoint';
export { default as getResourceTimingForUrl } from './utils/getResourceTimingForUrl';
export { initializeAnalytics } from './initializeAnalytics';
export { logAddinsCustomerContent } from './logAddinsCustomerContent';
export { logAddinsTelemetryEvent } from './logAddinsTelemetryEvent';
export { logPerformanceDatapoint } from './logPerformanceDatapoint';
export { logCLPAriaDataPoint } from './logCLPAriaDataPoint';
export { default as getActionableMessageLogger } from './utils/getActionableMessageLogger';
export { trackNetworkResponse } from './utils/trackNetworkResponse';
