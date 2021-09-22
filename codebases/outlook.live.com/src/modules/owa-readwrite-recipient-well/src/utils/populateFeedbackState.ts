import type FindControlViewState from 'owa-recipient-types/lib/types/FindControlViewState';
import { createPeopleFeedback } from 'owa-recipient-types/lib/types/PeopleFeedbackState';
import type PersonaType from 'owa-service/lib/contract/PersonaType';
import type { OwaDate } from 'owa-datetime';
import shouldUse3SPeopleSuggestions from 'owa-recipient-suggestions/lib/util/shouldUse3SPeopleSuggestions';

const CACHE_SOURCE = 'Cache';
const MAILBOX_SOURCE = 'Mailbox';
const DIRECTORY_SOURCE = 'Directory';
const FALLBACK_SOURCE = ' Fallback';

/**
 * Resets the feedback state
 * @param recipientWell the recipient well view state
 */
export function resetFeedbackState(recipientWell: FindControlViewState): void {
    recipientWell.peopleFeedbackState = { live: null, cache: null, directory: null };
}

/**
 * Used to document the beginning of the outgoing people search request to the feedback state
 * @param recipientWell the recipient well view state
 * @param transactionStartTime the start time of the outgoing request
 * @param clientRequestId the client request id for the outgoing request
 * @param directory whether it is a directory call
 */
export function populateFeedbackStateNetwork(
    recipientWell: FindControlViewState,
    transactionStartTime: OwaDate,
    correlationId: string,
    directory: boolean
): void {
    if (shouldUse3SPeopleSuggestions() && recipientWell.peopleFeedbackState) {
        let feedback = createPeopleFeedback();
        feedback.TimeStamp = transactionStartTime;
        feedback.QueryString = recipientWell.queryString;
        feedback.SuggestionSource = directory ? DIRECTORY_SOURCE : MAILBOX_SOURCE;

        feedback.RawResponse = 'pending';

        if (correlationId) {
            feedback.CorrelationId = correlationId;
        }

        if (directory) {
            recipientWell.peopleFeedbackState.directory = feedback;
        } else {
            recipientWell.peopleFeedbackState.live = feedback;
        }
    }
}

/**
 * Used to document the return/result of the people search response in the feedback state
 * @param recipientWell the recipient well view state
 * @param directory whether it is a directory call
 * @param traceId the trace id from the response
 * @param response the people search response
 * @param cacheComparisonInfo the optional debug info coming from the comparison of mailbox and cache generated suggestions
 */
export function updateFeedbackStateNetwork(
    recipientWell: FindControlViewState,
    directory: boolean,
    traceId: string,
    response: object,
    cacheComparisonInfo?: string
): void {
    if (shouldUse3SPeopleSuggestions() && recipientWell.peopleFeedbackState) {
        let rawResponse = response ? JSON.stringify(response) : 'no response';

        if (recipientWell?.peopleFeedbackState) {
            if (directory && recipientWell.peopleFeedbackState.directory) {
                recipientWell.peopleFeedbackState.directory.RawResponse = rawResponse;
                recipientWell.peopleFeedbackState.directory.TraceId = traceId;
            } else if (!directory && recipientWell.peopleFeedbackState.live) {
                if (cacheComparisonInfo) {
                    rawResponse += cacheComparisonInfo;
                }
                recipientWell.peopleFeedbackState.live.RawResponse = rawResponse;
                recipientWell.peopleFeedbackState.live.TraceId = traceId;
            }
        }
    }
}

/**
 * Used to populate the result of a cache lookup in the feedback state
 * @param recipientWell the recipient well view state
 * @param transactionStartTime the cache lookup start time
 * @param cacheResults the cache results
 * @param fallback whether this was a cache fallback
 */
export function populateFeedbackStateCache(
    recipientWell: FindControlViewState,
    transactionStartTime: OwaDate,
    cacheResults: PersonaType[],
    correlationId: string,
    fallback?: boolean
): void {
    if (shouldUse3SPeopleSuggestions() && recipientWell.peopleFeedbackState) {
        let feedback = createPeopleFeedback();
        feedback.QueryString = recipientWell.queryString;
        feedback.TimeStamp = transactionStartTime;
        feedback.SuggestionSource = fallback ? CACHE_SOURCE + FALLBACK_SOURCE : CACHE_SOURCE;
        feedback.RawResponse = cacheResults ? JSON.stringify(cacheResults) : 'no response';
        if (correlationId) {
            feedback.CorrelationId = correlationId;
        }

        recipientWell.peopleFeedbackState.cache = feedback;
    }
}
