import getCustomHeadersForNudgeRequest from './getCustomHeadersForNudgeRequest';
import type { GetNudgesResponse } from '../types/GetNudgesResponse';
import { FOCUSED_INBOX_REQUEST_BASE_URL } from '../utils/nudgeConstants';
import { makeGetRequest } from 'owa-ows-gateway';
import { isSuccessStatusCode } from 'owa-http-status-codes';
import sleep from 'owa-sleep';
import { shouldRetry } from './shouldRetry';

const GET_NUDGES_URL: string = FOCUSED_INBOX_REQUEST_BASE_URL + '/GetNudges';
const RETRY_DELAY_MS = 1500;

export interface GetNudgesResponseWithError {
    getNudgesResponse?: GetNudgesResponse;
    errorOrStatus: string;
    errorDetails?: string;
    retryAttempt?: number;
}

async function getNudgesOperation(correlationId: string): Promise<GetNudgesResponseWithError> {
    const headers = await getCustomHeadersForNudgeRequest(correlationId, 'getNudge');
    if (!headers) {
        return {
            getNudgesResponse: null,
            errorOrStatus: 'Token Failure',
        };
    }

    let getNudgesResponse;
    try {
        getNudgesResponse = await makeGetRequest(
            GET_NUDGES_URL,
            correlationId /* correlationId */,
            true /* returnFullResponse */,
            headers,
            true /* throwServiceError */,
            false /* includeCredentials */,
            'GetNudges'
        );
    } catch (error) {
        return {
            errorDetails: error.message,
            errorOrStatus: 'RequestNotComplete', // these could also mean that client network had problems
        };
    }

    try {
        if (isSuccessStatusCode(getNudgesResponse.status)) {
            const jsonResponse = await getNudgesResponse.json();
            if ((jsonResponse as GetNudgesResponse).Nudges) {
                return {
                    getNudgesResponse: <GetNudgesResponse>jsonResponse,
                    errorOrStatus: getNudgesResponse.status,
                };
            } else {
                const responseText = await getNudgesResponse.text();
                return {
                    errorOrStatus: 'No Nudges',
                    errorDetails: responseText,
                };
            }
        } else {
            let responseText = await getNudgesResponse.text();

            // html is as pii so don't log it.
            if (responseText?.toLowerCase().indexOf('html') > -1) {
                responseText = '';
            }

            return {
                errorOrStatus: getNudgesResponse.status,
                errorDetails: responseText,
            };
        }
    } catch (e) {
        return {
            errorOrStatus: 'Parse Error',
        };
    }
}

export function getNudges(correlationId: string): Promise<GetNudgesResponseWithError> {
    return getNudgesWithRetry(correlationId, 1 /* retryAttempt */, null);
}

async function getNudgesWithRetry(
    correlationId: string,
    retryAttempt: number,
    getNudgesResult: GetNudgesResponseWithError
): Promise<GetNudgesResponseWithError> {
    if (retryAttempt > 2) {
        return getNudgesResult;
    }

    getNudgesResult = await getNudgesOperation(correlationId);

    if (shouldRetry(getNudgesResult.errorOrStatus)) {
        await sleep(RETRY_DELAY_MS);
        return getNudgesWithRetry(correlationId, retryAttempt + 1, getNudgesResult);
    }

    getNudgesResult.retryAttempt = retryAttempt;
    return getNudgesResult;
}
