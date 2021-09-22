import { format } from 'owa-localize';
import attemptToSubmitAddEntityFeedback from './attemptToSubmitAddEntityFeedback';
import createSessionFeedbackEntry from './createSessionFeedbackEntry';
import type { FeedbackManagerState } from 'owa-feedback-manager/lib/store/schema/FeedbackManagerState';
import type { SessionFeedbackEntryParameters } from 'owa-feedback-manager/lib/store/schema/SessionFeedbackEntryParameters';
import type EntityFeedbackEntry from 'owa-service/lib/contract/EntityFeedbackEntry';

import { trace } from 'owa-trace';
import { action } from 'satcheljs/lib/legacy';

/**
 * Logs 'Pause session' the specified feedbackManagerState
 * @param feedbackManagerState: the feedback manager state
 */
export default action('pauseSession')(function pauseSession(
    feedbackManagerState: FeedbackManagerState
) {
    if (feedbackManagerState?.hasSessionStarted && !feedbackManagerState.isSessionPaused) {
        let sessionFeedbackEntryParameters: SessionFeedbackEntryParameters = {
            eventType: 'SessionPaused',
            recipientEmailAddresses: null,
            endSessionAction: null,
        };
        let entry: EntityFeedbackEntry = createSessionFeedbackEntry(
            feedbackManagerState,
            sessionFeedbackEntryParameters
        );
        attemptToSubmitAddEntityFeedback(feedbackManagerState, entry, false);
        feedbackManagerState.isSessionPaused = true;

        trace.info(
            format(
                '{0} pauseSession : Session paused. Session id: {1}',
                feedbackManagerState.entityScenarioName,
                feedbackManagerState.clientSessionId
            )
        );
    }
});
