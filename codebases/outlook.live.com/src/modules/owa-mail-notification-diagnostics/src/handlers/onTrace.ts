import * as trace from 'owa-trace';

export function onTraceWarning(message: string) {
    trace.trace.warn(message);
}

export function onTraceError(message: string) {
    trace.errorThatWillCauseAlert(message);
}
