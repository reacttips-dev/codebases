import { format } from 'owa-localize';
import type EntityFeedbackEntry from 'owa-service/lib/contract/EntityFeedbackEntry';
import { action } from 'satcheljs/lib/legacy';
import { addEntityFeedback } from '../services/addEntityFeedback';
import type { FeedbackManagerState } from 'owa-feedback-manager/lib/store/schema/FeedbackManagerState';

import { trace } from 'owa-trace';

/**
 * Attempt to submit the feedback to the server for the specified feedbackManagerState
 * @param feedbackManagerState: the feedback manager state
 * @param feedbackEntry: the feedback to submit
 * @param shouldSubmitImmediately: if true the feedback will not be buffererd but submitted immediately
 */
export default action('attemptToSubmitAddEntityFeedback')(function attemptToSubmitAddEntityFeedback(
    feedbackManagerState: FeedbackManagerState,
    feedbackEntry: EntityFeedbackEntry,
    shouldSubmitImmediately: boolean
) {
    if (feedbackManagerState && feedbackEntry) {
        feedbackManagerState.entityFeedbackEntries.push(feedbackEntry);

        if (
            shouldSubmitImmediately ||
            feedbackManagerState.entityFeedbackEntries.length >=
                feedbackManagerState.maxActionBatchSize
        ) {
            addEntityFeedback(feedbackManagerState.entityFeedbackEntries);
            trace.info(
                format(
                    '{0} Submitted {1} entities.',
                    feedbackManagerState.entityScenarioName,
                    feedbackManagerState.entityFeedbackEntries.length
                )
            );
            feedbackManagerState.entityFeedbackEntries = [];
        }
    }
});
