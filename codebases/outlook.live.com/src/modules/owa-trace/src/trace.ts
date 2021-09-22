import type { TraceErrorObject } from './TraceErrorObject';
import TraceLevel from './TraceLevel';
import { tryGetTraceObjectErrorFromApolloError } from './tryGetTraceObjectErrorFromApolloError';

const listeners: TraceListener[] = [];

export type TraceListener = (
    message: string,
    tracelevel: TraceLevel,
    errorObject?: TraceErrorObject
) => any;

export function registerTracerListener(traceListener: TraceListener) {
    listeners.push(traceListener);
}

function trace(message: string, traceLevel: TraceLevel, errorObject?: TraceErrorObject) {
    listeners.forEach(listener => {
        listener(message, traceLevel, errorObject);
    });
}

function info(message: string) {
    trace(message, TraceLevel.Info);
}

function warn(message: string) {
    trace(message, TraceLevel.Warning);
}

function verbose(message: string) {
    trace(message, TraceLevel.Verbose);
}

interface InternalTraceErrorObject extends TraceErrorObject {
    error?: Error;
}

/**
 * These errors will
 *     1) show an error popup
 *     2) be logged in traces that are collected
 */
export function debugErrorThatWillShowErrorPopupOnly(
    msg: TraceErrorObject | string,
    error?: TraceErrorObject
) {
    errorInternal(TraceLevel.DebugError, msg, error);
}

/**
 * These errors will
 *     1) be logged to the client_error table which is monitored
 *     2) show an error popup
 *     3) be logged in traces that are collected
 * The client_error table is monitored and and will stop deployment with stoplight,
 * and alert an OCE if the errors hit a certain threshold
 * Use logUsage in owa-analytics if you want to log an error that should not cause an alert.
 * Use debugErrorThatWillShowErrorPopupOnly if you don't want to log the error but still want to show
 * the popup
 * Use trace.warn if you would like to still see this in the trace logs
 */
export function errorThatWillCauseAlert(msg: TraceErrorObject | string, error?: TraceErrorObject) {
    errorInternal(TraceLevel.Error, msg, error);
}

function errorInternal(
    level: TraceLevel,
    msg: TraceErrorObject | string,
    error: TraceErrorObject | undefined
) {
    let info: InternalTraceErrorObject;
    let message: string;
    if (typeof msg === 'string') {
        message = msg;

        // The exception that bubbles up could be an ApolloError, so try to get the
        // TraceErrorObject embedded in it so our checks for error types work as expected.
        info = tryGetTraceObjectErrorFromApolloError(error) || new Error(msg);
    } else {
        info = msg || new Error('UnknownError');
        message = info.message;
    }

    if (info.error?.message && info.error.stack) {
        message = info.error.message;
        info.stack = info.error.stack;
        info.name = info.error.name;
    }

    if (info.component) {
        message = 'COMPONENT ERROR: ' + info.message;
    } else if (info.scriptEval) {
        message = 'EVAL ERROR: ' + info.message;
    }

    trace(message || '', level, info);
}

export default {
    info,
    warn,
    verbose,
};
