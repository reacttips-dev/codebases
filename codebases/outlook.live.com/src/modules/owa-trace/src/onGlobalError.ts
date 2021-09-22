import { errorThatWillCauseAlert } from './trace';
import type { TraceErrorObject } from './TraceErrorObject';

export const EmptyErrorStack = '[empty onerror]';

export default function onGlobalError(
    message: string,
    filename?: string,
    lineno?: number,
    colno?: number,
    error?: TraceErrorObject
) {
    // If we don't have a message or an error then we have no information about the error
    if (message || error) {
        if (!error) {
            error = new Error(message);
            error.stack = EmptyErrorStack;
        }
        message = message || error.message;

        // Making sure we can extend the error
        if (Object.isExtensible(error)) {
            // using Object.defineProperty because this properties can be read only some times
            Object.defineProperty(error, 'filename', { value: filename });
            Object.defineProperty(error, 'lineno', { value: lineno });
            Object.defineProperty(error, 'colno', { value: colno });
        }

        const alreadyReported = error?.reported;
        if (!alreadyReported) {
            // this will get picked up by any trace listeners for error that are registered globally
            errorThatWillCauseAlert(message, error);
        }
    }
}
