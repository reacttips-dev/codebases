import type FindControlViewState from 'owa-recipient-types/lib/types/FindControlViewState';
import transactionFailed from 'owa-controls-findpeople-feedback-manager/lib/actions/transactionFailed';
import type { OwaDate } from 'owa-datetime';

/**
 * Adds a relevance api transaction complete feedback
 */
export default function addTransactionFailed(
    recipientWellViewState: FindControlViewState,
    transactionRequestTime: OwaDate,
    transactionId: string
) {
    let context = {
        Action: 'Type Down',
    };

    transactionFailed(
        recipientWellViewState.findPeopleFeedbackManager,
        recipientWellViewState.queryString,
        transactionId,
        transactionRequestTime,
        context
    );
}
