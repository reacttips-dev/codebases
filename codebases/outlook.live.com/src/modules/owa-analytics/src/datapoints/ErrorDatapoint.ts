import { AriaDatapoint } from './AriaDatapoint';
import { Md5 } from 'ts-md5/dist/md5';
import type { TraceErrorObject } from 'owa-trace';
import { getActionStack, getActionQueue } from '../DatapointMiddleware';
import type { CustomDataMap } from 'owa-analytics-types';

const diagnosticsColumn = 'diagnostics';

export default class ErrorDatapoint extends AriaDatapoint {
    constructor(message: string, details: TraceErrorObject | undefined, props: CustomDataMap) {
        let hashValue = details?.stack || message;
        let hash = hashValue ? Md5.hashStr(hashValue) : -1;
        super(<string>hash, undefined, undefined, props);
        try {
            let diagnosticInfo = details?.diagnosticInfo || '';
            const actionStack = getActionStack();
            if (actionStack && actionStack.length > 0) {
                diagnosticInfo += '|stack:' + actionStack;
            }
            if (details?.component || details?.addQueue) {
                const actionQueue = getActionQueue();
                if (actionQueue && actionQueue.length > 0) {
                    diagnosticInfo += '|queue:' + actionQueue;
                }
            }
            this.addDataWithPiiScrubbing(diagnosticsColumn, diagnosticInfo);
            if (window?.navigator && typeof window.navigator.onLine == 'boolean') {
                this.addData('online', window.navigator.onLine);
            }
        } catch (e) {
            this.addDataWithPiiScrubbing(diagnosticsColumn, e.message);
        }
    }
}
