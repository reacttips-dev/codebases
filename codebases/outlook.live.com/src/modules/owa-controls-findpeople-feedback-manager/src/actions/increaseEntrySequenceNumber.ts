import { action } from 'satcheljs/lib/legacy';
import type { FeedbackManagerState } from 'owa-feedback-manager/lib/store/schema/FeedbackManagerState';

/**
 * Increases the entry sequence number
 * @param feedbackManagerState: the feedback manager state
 */
export default action('increaseEntrySequenceNumber')(function increaseEntrySequenceNumber(
    feedbackManagerState: FeedbackManagerState
) {
    if (feedbackManagerState) {
        feedbackManagerState.entrySequenceNumber++;
    }
});
