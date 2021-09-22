import { isMemoryError } from './isMemoryError';
import { isNetworkError } from './isNetworkError';
import isCorsIssue from './utils/isCorsIssue';
import getScriptInfoForLoadedScripts from './utils/getScriptInfoForLoadedScripts';
import * as trace from 'owa-trace';

type ErrorCategory = 'CORS' | 'NETWORK' | 'MEMORY' | 'SERVER' | 'AUTH';

export function categorizeError(
    message: string,
    error: trace.TraceErrorObject | undefined
): ErrorCategory | null {
    if (isCorsIssue(message)) {
        try {
            error = error || new Error();
            error.diagnosticInfo = error.diagnosticInfo || '';
            error.diagnosticInfo += getScriptInfoForLoadedScripts()
                .filter(s => s.cors === null && s.src != 'INLINE')
                .map(
                    info =>
                        `src:${info.src} parent:${info.parentNode} base:${info.baseUri} attr:${info.attributes}\n`
                );
        } catch (e) {
            trace.errorThatWillCauseAlert('getScriptInfoForLoadedScripts error', e);
        }
        return 'CORS';
    } else if (isMemoryError(message)) {
        return 'MEMORY';
    } else if (isNetworkError(message, error)) {
        return 'NETWORK';
    } else if (error) {
        if (error.fetchErrorType) {
            return error.fetchErrorType == 'AuthNeeded' ? 'AUTH' : 'SERVER';
        } else if (error.networkError) {
            return 'NETWORK';
        }
    }
    return null;
}
