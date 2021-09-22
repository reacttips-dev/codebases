import { logUsage } from 'owa-analytics';
import type { ErrorResponse } from '../contracts/ErrorResponse';
import { isSuccessStatusCode } from 'owa-http-status-codes';

export function logServiceResponse(
    actionName: string,
    response: Response,
    errorResponseBody: ErrorResponse
) {
    const isSuccess = isSuccessStatusCode(response.status);
    logUsage(actionName, {
        isSuccess_1: isSuccess,
        status_2: response.status,
        errorCode: isSuccess ? null : JSON.stringify(errorResponseBody?.error),
        errorDescription: isSuccess ? null : JSON.stringify(errorResponseBody?.errorDescription),
    });
}

export function logTooManyRequestsResponse(retryAfterInSeconds: number, apiName: string) {
    let retryAfterBucket = { lowerBoundSeconds: null, upperBoundSeconds: null };
    if (retryAfterInSeconds <= 0) {
        retryAfterBucket = { lowerBoundSeconds: null, upperBoundSeconds: 0 };
    } else if (retryAfterInSeconds <= 1) {
        retryAfterBucket = { lowerBoundSeconds: 0, upperBoundSeconds: 1 };
    } else if (retryAfterInSeconds <= 2) {
        retryAfterBucket = { lowerBoundSeconds: 1, upperBoundSeconds: 2 };
    } else if (retryAfterInSeconds <= 5) {
        retryAfterBucket = { lowerBoundSeconds: 2, upperBoundSeconds: 5 };
    } else if (retryAfterInSeconds <= 10) {
        retryAfterBucket = { lowerBoundSeconds: 5, upperBoundSeconds: 10 };
    } else if (retryAfterInSeconds <= 30) {
        retryAfterBucket = { lowerBoundSeconds: 10, upperBoundSeconds: 30 };
    } else if (retryAfterInSeconds > 60) {
        retryAfterBucket = { lowerBoundSeconds: 30, upperBoundSeconds: 60 };
    } else {
        retryAfterBucket = { lowerBoundSeconds: null, upperBoundSeconds: null };
    }
    logUsage('ConnectedAccounts429Error', {
        retryAfterLowerBound_1: retryAfterBucket.lowerBoundSeconds,
        retryAfterUpperBound_2: retryAfterBucket.upperBoundSeconds,
        apiName_3: apiName,
    });
}
