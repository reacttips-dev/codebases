import { format } from 'owa-localize';
import attemptToSubmitAddEntityFeedback from './attemptToSubmitAddEntityFeedback';
import createSessionFeedbackEntry from './createSessionFeedbackEntry';
import type { FeedbackManagerState } from 'owa-feedback-manager/lib/store/schema/FeedbackManagerState';
import type { SessionFeedbackEntryParameters } from 'owa-feedback-manager/lib/store/schema/SessionFeedbackEntryParameters';
import type EntityFeedbackEntry from 'owa-service/lib/contract/EntityFeedbackEntry';

import { trace } from 'owa-trace';
import { action } from 'satcheljs/lib/legacy';

/**
 * Logs resume session for the specified feedbackManagerState
 * @param feedbackManagerState: the feedback manager state
 * @param recipientEmailAddresses: the recipient email addresses
 */
export default action('resumeSession')(function resumeSession(
    feedbackManagerState: FeedbackManagerState
) {
    if (feedbackManagerState?.isSessionPaused) {
        let sessionFeedbackEntryParameters: SessionFeedbackEntryParameters = {
            eventType: 'SessionResumed',
            recipientEmailAddresses: null,
            endSessionAction: null,
        };

        let entry: EntityFeedbackEntry = createSessionFeedbackEntry(
            feedbackManagerState,
            sessionFeedbackEntryParameters
        );
        attemptToSubmitAddEntityFeedback(feedbackManagerState, entry, false);

        feedbackManagerState.isSessionPaused = false;

        trace.info(
            format(
                '{0} FeedbackManagerBase.ResumeSession: Session resumed. Session id: {1}',
                feedbackManagerState.entityScenarioName,
                feedbackManagerState.clientSessionId
            )
        );
    }
});
