import { format } from 'owa-localize';
import { makePatchRequest } from 'owa-ows-gateway';
import type {
    GetAccessTokenResponse,
    ConnectedAccountResponse,
} from '../contracts/ConnectedAccountResponse';
import {
    FullErrorResponse,
    ErrorResponse,
    ErrorType,
    TooManyRequestsFullErrorResponse,
} from '../contracts/ErrorResponse';
import { isSuccessStatusCode, HttpStatusCode } from 'owa-http-status-codes';
import { logServiceResponse, logTooManyRequestsResponse } from '../utils/logServiceResponseUtils';

const refreshConnectedAccountAccessTokenUrl: string = 'ows/beta/ConnectedAccounts/refreshtoken/{0}';

export function refreshConnectedAccountAccessToken(
    id: string
): Promise<GetAccessTokenResponse | FullErrorResponse> {
    return makePatchRequest(
        format(refreshConnectedAccountAccessTokenUrl, id),
        null /* requestObject */,
        undefined /* correlation id */,
        true /* returnFullResponse */
    )
        .then(async (response: Response) => {
            const responseBody = <ConnectedAccountResponse | ErrorResponse>await response.json();
            const errorResponseBody = responseBody as ErrorResponse;
            logServiceResponse('refreshToken_serviceResponse', response, errorResponseBody);
            if (isSuccessStatusCode(response.status)) {
                return {
                    ConnectedAccountResponse: responseBody,
                    isSuccess: true,
                } as GetAccessTokenResponse;
            } else if (
                response.status == HttpStatusCode.BadRequest ||
                response.status == HttpStatusCode.NotFound
            ) {
                return {
                    errorResponse: responseBody,
                    isSuccess: false,
                } as FullErrorResponse;
            } else {
                if (response.status == HttpStatusCode.TooManyRequests) {
                    const retryAfter = Number(response.headers.get('RetryAfter').slice(-2));
                    logTooManyRequestsResponse(retryAfter, 'refreshAccountToken');

                    return {
                        errorResponse: {
                            error: ErrorType[ErrorType.TooManyRequests],
                        } as ErrorResponse,
                        isSuccess: false,
                        retryAfter: retryAfter,
                    } as TooManyRequestsFullErrorResponse;
                }
                return {
                    errorResponse: { error: ErrorType[ErrorType.Transient] } as ErrorResponse,
                    isSuccess: false,
                } as FullErrorResponse;
            }
        })
        .catch(err => {
            return {
                errorResponse: {
                    error: ErrorType[ErrorType.Unknown],
                    errorDescription: JSON.stringify(err),
                } as ErrorResponse,
                isSuccess: false,
            } as FullErrorResponse;
        });
}
