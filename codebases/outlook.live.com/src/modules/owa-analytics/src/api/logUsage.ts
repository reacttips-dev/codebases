import type { DatapointOptions, CustomData } from 'owa-analytics-types';
import { lazyLogUsage } from '../lazyFunctions';

export function logUsage(
    eventName: string,
    customData?: CustomData,
    options?: DatapointOptions
): Promise<void> {
    return lazyLogUsage.importAndExecute(eventName, customData, options);
}
