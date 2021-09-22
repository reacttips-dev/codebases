import getFindPeopleResultsAsEntityIds from './getFindPeopleResultsAsEntityIds';
import type FindControlViewState from 'owa-recipient-types/lib/types/FindControlViewState';
import localCacheTransactionCompleted from 'owa-controls-findpeople-feedback-manager/lib/actions/localCacheTransactionCompleted';
import personaTypeMap from 'owa-controls-findpeople-feedback-manager/lib/utils/PersonaTypeMap';
import isFeatureDataLoggingEnabled from 'owa-substrate-people-suggestions/lib/utils/isFeatureDataLoggingEnabled';
import type { OwaDate } from 'owa-datetime';

/**
 * Adds a local cache transaction complete feedback
 */
export default function addLocalCacheTransactionComplete(
    recipientWellViewState: FindControlViewState,
    transactionStartTime: OwaDate
) {
    if (recipientWellViewState.findResultSet && recipientWellViewState.findResultSet.length > 0) {
        let personaTypeList = [];
        recipientWellViewState.findResultSet.forEach(suggestion => {
            personaTypeList.push(personaTypeMap[suggestion.PersonaTypeString]);
        });
        localCacheTransactionCompleted(
            recipientWellViewState.findPeopleFeedbackManager,
            recipientWellViewState.queryString,
            getFindPeopleResultsAsEntityIds(recipientWellViewState.findResultSet),
            isFeatureDataLoggingEnabled()
                ? recipientWellViewState.findResultSet.map(x =>
                      x.FeatureData ? x.FeatureData : ''
                  )
                : null,
            personaTypeList,
            recipientWellViewState.peopleFeedbackState?.cache?.CorrelationId,
            transactionStartTime
        );
    }
}
