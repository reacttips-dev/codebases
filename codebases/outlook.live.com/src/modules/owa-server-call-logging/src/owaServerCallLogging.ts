import type { PerformanceDatapoint } from 'owa-analytics';
import type { TraceErrorObject } from 'owa-trace';

export function logResponseDataForOwaServerCalls(
    datapoint: PerformanceDatapoint,
    response: Response
): void {
    if (response && datapoint) {
        datapoint.addCustomData({ httpStatusCode: response.status });
        addHeadersToDataPointForOwaServerCalls(datapoint, response.headers);
    }
}

export function addHeadersToDataPointForOwaServerCalls(
    datapoint: PerformanceDatapoint,
    headers: Headers
): void {
    if (headers && datapoint) {
        datapoint.addCustomData({
            frontendServer: headers.get('x-feserver'),
            requestId: headers.get('request-id'),
            backendServer: headers.get('x-beserver'),
            backendHttpStatus: headers.get('x-backendhttpstatus'),
            serverVersion: headers.get('x-owa-version'),
        });
    }
}

export function isServiceFetchError(error: TraceErrorObject): boolean {
    return error && error.fetchErrorType !== undefined;
}

export function logServerCallErrorMessage(datapoint: PerformanceDatapoint, error: string): void {
    datapoint.addCustomProperty('ErrorInformation', error);
}

export function logErrorForEmptyOrNullResponse(
    datapoint: PerformanceDatapoint,
    response: any
): void {
    let customErrorData = '';

    if (!response) {
        customErrorData = 'Null response from server';
    } else {
        customErrorData = 'Empty response from server';
    }

    logServerCallErrorMessage(datapoint, customErrorData);
}
