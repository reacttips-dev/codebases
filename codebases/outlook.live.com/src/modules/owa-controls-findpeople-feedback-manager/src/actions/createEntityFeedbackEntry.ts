import { format } from 'owa-localize';
import type EntityAddSource from 'owa-service/lib/contract/EntityAddSource';
import type EntityFeedbackEntry from 'owa-service/lib/contract/EntityFeedbackEntry';
import increaseEntrySequenceNumber from './increaseEntrySequenceNumber';
import type {
    eventType,
    FeedbackManagerState,
} from 'owa-feedback-manager/lib/store/schema/FeedbackManagerState';

import { isNullOrWhiteSpace } from 'owa-string-utils';
import { trace } from 'owa-trace';
import { getEwsRequestString, getISOString, now, OwaDate } from 'owa-datetime';

/**
 * Creates a EntityFeedbackEntry for the specified feedback manager and event type.
 * @param feedbackManagerState: the feedback manager state
 * @param transactionId: the transaction id
 * @param eventType: the feedback event type to submit
 * @param targetEntityList: the target entity list
 * @param entityAddSource: the entity source
 * @param jsonPropertyBag: Json property bag
 * @param scenarioName: the scenario name for this entity. If not specified we used the scenario name from the feedbackManagerState
 */
export default function createEntityFeedbackEntry(
    feedbackManagerState: FeedbackManagerState,
    transactionId: string,
    eventType: eventType,
    targetEntityList: string,
    entityAddSource: EntityAddSource,
    jsonPropertyBag: string,
    scenarioName?: string,
    eventTime: OwaDate = now()
): EntityFeedbackEntry {
    if (!feedbackManagerState) {
        trace.warn('Attempting to create entity feedback entry with invalid feedbackManager');
        return null;
    }

    if (isNullOrWhiteSpace(feedbackManagerState.clientSessionId)) {
        trace.warn(
            format(
                '{0} - Attempting to create entity feedback entry with empty client session id',
                feedbackManagerState.entityScenarioName
            )
        );
        return null;
    }

    let entry: EntityFeedbackEntry = {
        ClientEventTimeUtc: getISOString(eventTime),
        ClientEventTimeLocal: getEwsRequestString(eventTime),
        ClientSessionId: feedbackManagerState.clientSessionId,
        ClientVersion: feedbackManagerState.clientVersion,
        ClientId: feedbackManagerState.clientId,
        EntityType: feedbackManagerState.entityType,
        EntrySequenceNumber: feedbackManagerState.entrySequenceNumber,
        TransactionId: transactionId,
        EventType: eventType,
        TargetEntityList: targetEntityList,
        EntityAddSource: entityAddSource,
        JsonPropertyBag: jsonPropertyBag,
        ScenarioName: scenarioName ? scenarioName : feedbackManagerState.entityScenarioName,
    };

    increaseEntrySequenceNumber(feedbackManagerState);

    return entry;
}
