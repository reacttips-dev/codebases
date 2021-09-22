import type { TraceErrorObject } from 'owa-trace';

export default function createServiceFetchError(
    responseCode: string | undefined,
    stackTrace: string | undefined,
    messageText: string | undefined
): Error {
    let errorMessage = 'ResponseCode=' + responseCode;
    if (stackTrace) {
        errorMessage += ', Stacktrace=' + stackTrace;
    }
    const error: TraceErrorObject = new Error(errorMessage);
    error.responseCode = responseCode;
    error.fetchErrorType = 'ServerFailure';
    if (messageText) {
        error.diagnosticInfo = 'MessageText= ' + messageText;
    }

    return error;
}
