import transactionCompleted from 'owa-controls-findpeople-feedback-manager/lib/actions/transactionCompleted';
import type { OwaDate } from 'owa-datetime';
import getFindPeopleResultsAsEntityIds from './getFindPeopleResultsAsEntityIds';
import type FindRecipientPersonaType from 'owa-recipient-types/lib/types/FindRecipientPersonaType';
import type FindControlViewState from 'owa-recipient-types/lib/types/FindControlViewState';
import personaTypeMap from 'owa-controls-findpeople-feedback-manager/lib/utils/PersonaTypeMap';

/**
 * Adds a relevance api transaction complete feedback
 */
export default function addTransactionComplete(
    findResultSet: FindRecipientPersonaType[],
    recipientWellViewState: FindControlViewState,
    transactionRequestTime: OwaDate,
    transactionId: string
) {
    let personaTypeList = findResultSet.map(x => personaTypeMap[x.PersonaTypeString]);
    let context = {
        Action: 'Type Down',
    };

    transactionCompleted(
        recipientWellViewState.findPeopleFeedbackManager,
        recipientWellViewState.queryString,
        getFindPeopleResultsAsEntityIds(findResultSet),
        transactionId,
        transactionRequestTime,
        context,
        personaTypeList,
        { CacheCorrelationId: recipientWellViewState.peopleFeedbackState?.cache?.CorrelationId }
    );
}
