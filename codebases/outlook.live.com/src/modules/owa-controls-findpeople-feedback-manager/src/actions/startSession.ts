import { format } from 'owa-localize';
import attemptToSubmitAddEntityFeedback from './attemptToSubmitAddEntityFeedback';
import createSessionFeedbackEntry from './createSessionFeedbackEntry';
import type { FeedbackManagerState } from 'owa-feedback-manager/lib/store/schema/FeedbackManagerState';
import type { SessionFeedbackEntryParameters } from 'owa-feedback-manager/lib/store/schema/SessionFeedbackEntryParameters';
import { getGuid } from 'owa-guid';
import type EntityFeedbackEntry from 'owa-service/lib/contract/EntityFeedbackEntry';

import { trace } from 'owa-trace';
import { action } from 'satcheljs/lib/legacy';

/**
 * Logs start session for the specified feedbackManagerState
 * @param feedbackManagerState: the feedback manager state
 * @param recipientEmailAddresses: the recipient email addresses
 */
export default action('startSession')(function startSession(
    feedbackManagerState: FeedbackManagerState,
    recipientEmailAddresses: string[]
) {
    if (feedbackManagerState) {
        if (!feedbackManagerState.hasSessionStarted) {
            feedbackManagerState.clientSessionId = getGuid();
            let sessionFeedbackEntryParameters: SessionFeedbackEntryParameters = {
                eventType: 'SessionStarted',
                recipientEmailAddresses: recipientEmailAddresses,
                endSessionAction: null,
            };

            let entry: EntityFeedbackEntry = createSessionFeedbackEntry(
                feedbackManagerState,
                sessionFeedbackEntryParameters
            );
            attemptToSubmitAddEntityFeedback(feedbackManagerState, entry, true);
            feedbackManagerState.hasSessionStarted = true;

            trace.info(
                format(
                    '{0} StartSession: Session started. Session id: {1}',
                    feedbackManagerState.entityScenarioName,
                    feedbackManagerState.clientSessionId
                )
            );
        } else {
            trace.info(
                format('{0} StartSession: failed to start', feedbackManagerState.entityScenarioName)
            );
        }
    }
});
