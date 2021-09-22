/*
The logging addaptor provides an interface to inject logging callbacks for both error and
event delegate.
In case of error, the provided error callback will be called (if any).
In case of event (user action), the provided event callback will be called (if any).
*/
export interface OnErrorDelegate {
    (errorCode: string, errorDetails: string[]): void;
}

export interface OnEventDelegate {
    (eventName: string, actionDetails: string[]): void;
}

export var logInfo: OnEventDelegate;

export var logError: OnErrorDelegate;

export function initializeLoggingCallbacks(
    errorCallback: OnErrorDelegate,
    infoCallback: OnEventDelegate
): void {
    logError = errorCallback;
    logInfo = infoCallback;
}
