import { format } from 'owa-localize';
import attemptToSubmitAddEntityFeedback from './attemptToSubmitAddEntityFeedback';
import createSessionFeedbackEntry from './createSessionFeedbackEntry';
import type {
    FeedbackManagerState,
    endSessionAction,
} from 'owa-feedback-manager/lib/store/schema/FeedbackManagerState';
import type { SessionFeedbackEntryParameters } from 'owa-feedback-manager/lib/store/schema/SessionFeedbackEntryParameters';
import type EntityFeedbackEntry from 'owa-service/lib/contract/EntityFeedbackEntry';

import { trace } from 'owa-trace';
import { action } from 'satcheljs/lib/legacy';

/**
 * Logs 'End session' the specified feedbackManagerState
 * @param feedbackManagerState: the feedback manager state
 * @param endSessionAction: the action that ends the session, for instance, 'Send', 'Discard', etc.
 */
export default action('endSession')(function endSession(
    feedbackManagerState: FeedbackManagerState,
    endSessionAction: endSessionAction
) {
    if (feedbackManagerState?.hasSessionStarted) {
        let sessionFeedbackEntryParameters: SessionFeedbackEntryParameters = {
            eventType: 'SessionEnded',
            recipientEmailAddresses: null,
            endSessionAction: endSessionAction,
        };
        let entry: EntityFeedbackEntry = createSessionFeedbackEntry(
            feedbackManagerState,
            sessionFeedbackEntryParameters
        );
        attemptToSubmitAddEntityFeedback(feedbackManagerState, entry, true);

        trace.info(
            format(
                '{0} EndSession : Session ended. Session id: {1}',
                feedbackManagerState.entityScenarioName,
                feedbackManagerState.clientSessionId
            )
        );
        feedbackManagerState.clientSessionId = '';
        feedbackManagerState.hasSessionStarted = false;
    }
});
