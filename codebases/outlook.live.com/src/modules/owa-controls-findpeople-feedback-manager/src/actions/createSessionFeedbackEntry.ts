import { isStringNullOrWhiteSpace, format } from 'owa-localize';
import createEntityFeedbackEntry from './createEntityFeedbackEntry';
import EntityAddSource from 'owa-service/lib/contract/EntityAddSource';
import type EntityFeedbackEntry from 'owa-service/lib/contract/EntityFeedbackEntry';

import type { FeedbackManagerState } from 'owa-feedback-manager/lib/store/schema/FeedbackManagerState';
import type { SessionFeedbackEntryParameters } from 'owa-feedback-manager/lib/store/schema/SessionFeedbackEntryParameters';

import { trace } from 'owa-trace';

/**
 * Creates a EntityFeedbackEntry for the specified feedback manager and event type.
 * @param feedbackManagerState: the feedback manager state
 * @param eventType: the feedback event type to submit
 */
export default function createSessionFeedbackEntry(
    feedbackManagerState: FeedbackManagerState,
    parameters: SessionFeedbackEntryParameters
): EntityFeedbackEntry {
    if (isStringNullOrWhiteSpace(feedbackManagerState.clientSessionId)) {
        trace.warn(
            format(
                '{0} - Attempting to create session feedback entry with empty client session id',
                feedbackManagerState.entityScenarioName
            )
        );
        return null;
    }

    let targetList = '';
    if (parameters) {
        targetList =
            parameters.recipientEmailAddresses == null
                ? ''
                : JSON.stringify(parameters.recipientEmailAddresses);
    }

    let jsonPropertyBag = '';
    if (!isStringNullOrWhiteSpace(parameters.endSessionAction)) {
        let jsonPropertyBagDictionary = {
            EndSessionAction: parameters.endSessionAction,
        };

        jsonPropertyBag = JSON.stringify(jsonPropertyBagDictionary);
    }

    // Creating a new entity feedback entry will increase the entry sequence number
    return createEntityFeedbackEntry(
        feedbackManagerState,
        '' /* transactionId*/,
        parameters.eventType,
        targetList,
        EntityAddSource.None,
        jsonPropertyBag
    );
}
