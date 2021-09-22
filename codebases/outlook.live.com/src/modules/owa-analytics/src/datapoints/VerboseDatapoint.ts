import { PerformanceDatapoint } from './PerformanceDatapoint';
import type { DatapointOptions } from 'owa-analytics-types';

export default class VerboseDatapoint extends PerformanceDatapoint {
    constructor(eventName: string, options?: DatapointOptions) {
        super(eventName, {
            ...options,
            isVerbose: true,
        });
    }
}
