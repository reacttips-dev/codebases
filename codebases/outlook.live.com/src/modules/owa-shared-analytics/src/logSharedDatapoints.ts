import { PerformanceDatapoint, logUsage } from 'owa-analytics';
import type { CustomData } from 'owa-analytics-types';

export function logCalendarUsage(
    eventName: string,
    customData?: CustomData,
    cosmosOnlyData?: string
) {
    logUsage(eventName, customData, { cosmosOnlyData, isCore: true });
}

export function createCalendarPerfDatapoint(eventName: string) {
    return new PerformanceDatapoint(eventName, { isCore: true });
}
