import ClientIdType from 'owa-service/lib/contract/ClientIdType';
import EntityType from 'owa-service/lib/contract/EntityType';
import type { FeedbackManagerState } from 'owa-feedback-manager/lib/store/schema/FeedbackManagerState';
import { getGuid } from 'owa-guid';

/*
 * Invokes createFindPeopleFeedbackManager.
 */
export default function createFindPeopleFeedbackManager(): FeedbackManagerState {
    return {
        maxActionBatchSize: 10,
        entityType: EntityType.People,
        entityScenarioName: 'FindPeople_react',
        hasSessionStarted: false,
        isSessionPaused: false,
        entityFeedbackEntries: [],
        clientSessionId: '',
        clientVersion: '1.0',
        clientId: ClientIdType.Web,
        entrySequenceNumber: 0,
        conversationId: getGuid(),
    } as FeedbackManagerState;
}
