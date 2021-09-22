import type { NudgedReason } from 'owa-mail-nudge-store';
import { logUsage } from 'owa-analytics';
import getCustomHeadersForNudgeRequest from './getCustomHeadersForNudgeRequest';
import type { NudgeAction, UpdateNudgesRequest } from '../types/UpdateNudgesRequest';
import { FOCUSED_INBOX_REQUEST_BASE_URL } from '../utils/nudgeConstants';
import { getGuid } from 'owa-guid';
import { isSuccessStatusCode } from 'owa-http-status-codes';
import { makePostRequest } from 'owa-ows-gateway';
import sleep from 'owa-sleep';
import { shouldRetry } from './shouldRetry';
import { scrubForPii } from 'owa-config';

const UPDATE_NUDGES_URL: string = FOCUSED_INBOX_REQUEST_BASE_URL + '/UpdateNudge';
const RETRY_DELAY_MS = 1500;

interface UpdateNudgesResponse {
    errorMessage: string;
    status?: number;
    errorDetails?: string;
}

async function updateNudgesOperation(
    itemId: string,
    nudgeAction: NudgeAction,
    corelationId: string
): Promise<UpdateNudgesResponse> {
    const headers = await getCustomHeadersForNudgeRequest(corelationId, 'updateNudge');
    if (!headers) {
        return {
            errorMessage: 'Token Failure',
        };
    }

    const requestBody: UpdateNudgesRequest = {
        ItemId: { Id: itemId },
        NudgeAction: nudgeAction,
    };

    let updateNudgesResponse;
    try {
        updateNudgesResponse = await makePostRequest(
            UPDATE_NUDGES_URL,
            requestBody,
            corelationId,
            true /* returnFullResponse */,
            headers,
            true /* throwServiceError */,
            false /* sendPayloadAsBody */,
            false /* includeCredentials */,
            'UpdateNudges',
            null /* datapoint */,
            true /* doNotAddImmutableIdHeader */
            // We are temporarily disabling passing ImmutableIds to updateNudge api
            // till the server issue of updateNudge operation failing when using ImmutableIds is fixed.
        );
    } catch (error) {
        return {
            errorDetails: error.message,
            errorMessage: 'RequestNotComplete', // these could also mean that client network had problems
        };
    }

    try {
        const status = updateNudgesResponse.status;
        if (isSuccessStatusCode(status)) {
            return {
                status: status,
                errorMessage: 'No error',
                errorDetails: '',
            };
        }

        let responseText = await updateNudgesResponse.text();

        // html is as pii so don't log it.
        if (responseText?.toLowerCase().indexOf('html') > -1) {
            responseText = '';
        }
        return {
            status: status,
            errorMessage: status,
            errorDetails: responseText,
        };
    } catch (error) {
        return {
            errorMessage: 'Parse Error',
        };
    }
}

export function updateNudge(
    itemId: string,
    nudgeAction: NudgeAction,
    actionSource: string,
    nudgeReason: NudgedReason
) {
    const corelationId = getGuid();
    return updateNudgeWithRetry(
        itemId,
        nudgeAction,
        actionSource,
        nudgeReason,
        1,
        RETRY_DELAY_MS,
        corelationId
    );
}

async function updateNudgeWithRetry(
    itemId: string,
    nudgeAction: NudgeAction,
    actionSource: string,
    nudgeReason: NudgedReason,
    retryAttempt: number,
    retryDelay: number,
    corelationId: string
): Promise<void> {
    if (retryAttempt > 3) {
        return;
    }

    const updateNudgeResponse = await updateNudgesOperation(itemId, nudgeAction, corelationId);

    logUpdateNudge(
        nudgeAction,
        actionSource,
        nudgeReason,
        itemId,
        updateNudgeResponse.errorMessage,
        updateNudgeResponse.errorDetails,
        updateNudgeResponse.status,
        retryAttempt,
        corelationId
    );

    if (shouldRetry(updateNudgeResponse.status.toString())) {
        await sleep(retryDelay);
        updateNudgeWithRetry(
            itemId,
            nudgeAction,
            actionSource,
            nudgeReason,
            retryAttempt + 1,
            retryDelay * 2,
            corelationId
        );
    }
}

/**
 * Logs Nudge Update actions (PinUnpin / MarkComplete / Dismissed)
 * @param nudgeAction  the nudge action
 * @param actionSource source from where the nudge action is performed
 * @param reason the nudge reason
 * @param itemId the item id of the nudge item
 * @param errorOrStatus string containing status code or error message
 * @param errorDetails error details
 * @param retryAttempt retry attempt
 * @param corelationId corelationId
 */
function logUpdateNudge(
    nudgeAction: NudgeAction,
    actionSource: string,
    reason: NudgedReason,
    itemId: string,
    errorOrStatus: string,
    errorDetails: string,
    status: number,
    retryAttempt: number,
    corelationId: string
) {
    logUsage(
        'Nudge_Update',
        {
            owa_1: nudgeAction,
            owa_2: actionSource,
            owa_3: reason,
            owa_4: errorOrStatus,
            owa_5: status,
            itemId: itemId,
            errorDetails: scrubForPii(errorDetails),
            rA: retryAttempt,
            crId: corelationId,
        },
        {
            isCore: true,
        }
    );
}
