import type { DatapointOptions, CustomData } from 'owa-analytics-types';
import VerboseDatapoint from '../datapoints/VerboseDatapoint';

export function logVerboseUsage(
    eventName: string,
    customData?: CustomData,
    options?: DatapointOptions
): void {
    let dp = new VerboseDatapoint(eventName, options);
    if (customData) {
        dp.addCustomData(customData);
    }
    dp.end();
}
