import { setConfig } from 'owa-bundling-light';
import markImportAsLoaded from './mutators/markImportAsLoaded';
import isImportLoaded from './selectors/isImportLoaded';
import type { LogUsageFunction } from 'owa-analytics-types';
import * as trace from 'owa-trace';

export function setBundlingConfig(logUsage: LogUsageFunction) {
    setConfig({
        markImportAsLoaded,
        isImportLoaded,
        logUsage,
        logError: trace.errorThatWillCauseAlert,
    });
}
