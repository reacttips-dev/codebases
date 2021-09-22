import { isSuccessStatusCode } from 'owa-http-status-codes';
import type { TraceErrorObject } from 'owa-trace';
import type { FavoriteOperationError } from 'owa-favorites-types';

const CV_REGEX = /cv=([^&]+)&?.*$/;
/**
 * Performs an operation and checks the status code to either return the response object,
 * or throw an error with status code and error message
 * @param operation: the operation to be performed.
 *      The function expect this operation to either return a full response, or to reject with a fetch failure.
 */
export async function makeRequestWithFullResponseErrorHandling(
    operation: () => Promise<any>
): Promise<any> {
    let isFavoritingError = false;
    try {
        const response = await operation();
        const responseObj = await response.text().then(text => (text ? JSON.parse(text) : {}));
        if (isSuccessStatusCode(response.status)) {
            return responseObj;
        } else {
            isFavoritingError = true;
            throw createFavoriteOperationError(
                response.status,
                response.url,
                responseObj?.error?.code
            );
        }
    } catch (error) {
        if (isFavoritingError) {
            throw error;
        }
        throw createFavoriteNetworkError(error);
    }
}

function createFavoriteOperationError(
    status: number,
    url: string,
    errorCode: string
): FavoriteOperationError {
    const correlationVector = getCorrelationVectorFromUrl(url);
    return {
        message: `Request failed with Status Code: ${status} - Error Code: ${errorCode} --- cV: ${correlationVector}`,
        statusCode: status,
        correlationVector: correlationVector,
    } as FavoriteOperationError;
}

function createFavoriteNetworkError(error: TraceErrorObject): FavoriteOperationError {
    const errorMessage = error ? error.message : 'No error message';
    const errorStack = error ? error.stack : 'No error stack';
    return {
        message: `Request failed with a network error - ErrorMessage: ${errorMessage} - ErrorStack: ${errorStack}`,
        statusCode: undefined,
        correlationVector: error.correlationVector,
    } as FavoriteOperationError;
}

function getCorrelationVectorFromUrl(requestUrl: string): string {
    const matches = requestUrl && requestUrl.match(CV_REGEX);
    return matches && matches.length === 2 ? decodeURIComponent(matches[1]) : 'No CV was found';
}
