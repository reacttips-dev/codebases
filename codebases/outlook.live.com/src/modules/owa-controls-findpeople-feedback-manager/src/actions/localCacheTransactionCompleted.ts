import { isStringNullOrWhiteSpace, format } from 'owa-localize';
import attemptToSubmitAddEntityFeedback from './attemptToSubmitAddEntityFeedback';
import createEntityFeedbackEntry from './createEntityFeedbackEntry';
import { OwaDate, differenceInMilliseconds, now, getEwsRequestString } from 'owa-datetime';
import type { FeedbackManagerState } from 'owa-feedback-manager/lib/store/schema/FeedbackManagerState';
import EntityAddSource from 'owa-service/lib/contract/EntityAddSource';
import type EntityFeedbackEntry from 'owa-service/lib/contract/EntityFeedbackEntry';
import { isNullOrWhiteSpace } from 'owa-string-utils';

import { trace } from 'owa-trace';
import { action } from 'satcheljs/lib/legacy';
import { getGuid } from 'owa-guid';

/**
 * Logs 'local cache transaction completed' for the specified feedbackManagerState
 * @param feedbackManagerState: the feedback manager state
 */
export default action('localCacheTransactionCompleted')(function localCacheTransactionCompleted(
    feedbackManagerState: FeedbackManagerState,
    queryString: string,
    recipientEmailAddresses: string[],
    featureStores: string[],
    personaTypeList: number[],
    correlationId: string,
    transactionRequestTime: OwaDate = now()
) {
    if (feedbackManagerState?.hasSessionStarted) {
        let jsonPropertyBagDictionary = {
            TransactionRequestTime: getEwsRequestString(transactionRequestTime),
            TransactionRequestDuration: differenceInMilliseconds(now(), transactionRequestTime),
            QueryString: isStringNullOrWhiteSpace(queryString) ? '' : queryString,
            QueryStringLength: isNullOrWhiteSpace(queryString) ? 0 : queryString.length,
            FeatureData: featureStores != null ? featureStores : undefined,
            personaTypeList: personaTypeList,
            ImpressionId: getGuid(),
            Cvid: feedbackManagerState.conversationId,
            CacheCorrelationId: correlationId,
        };

        let jsonPropertyBag = JSON.stringify(jsonPropertyBagDictionary);
        let targetList = JSON.stringify(recipientEmailAddresses);

        let entry: EntityFeedbackEntry = createEntityFeedbackEntry(
            feedbackManagerState,
            '',
            'LocalCacheTransactionCompleted',
            targetList,
            EntityAddSource.None,
            jsonPropertyBag
        );

        attemptToSubmitAddEntityFeedback(feedbackManagerState, entry, false);

        trace.info(
            format(
                '{0} LocalCacheTransactionCompleted. Session id: {1}',
                feedbackManagerState.entityScenarioName,
                feedbackManagerState.clientSessionId
            )
        );
    }
});
