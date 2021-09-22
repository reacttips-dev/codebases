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

/**
 * Logs 'Transaction completed' for the specified feedbackManagerState
 * @param feedbackManagerState: the feedback manager state
 */
export default action('transactionCompleted')(function transactionCompleted(
    feedbackManagerState: FeedbackManagerState,
    queryString: string,
    entityIds: string[],
    transactionId: string,
    transactionRequestTime: OwaDate,
    context: any,
    personaTypeList: number[],
    extraData: { [index: string]: any } = null
) {
    if (feedbackManagerState?.hasSessionStarted) {
        let jsonPropertyBagDictionary = {
            TransactionRequestTime: getEwsRequestString(transactionRequestTime),
            TransactionRequestDuration: differenceInMilliseconds(now(), transactionRequestTime),
            QueryString: isStringNullOrWhiteSpace(queryString) ? '' : queryString,
            QueryStringLength: isNullOrWhiteSpace(queryString) ? 0 : queryString.length,
            PersonaTypeList: personaTypeList,
            ImpressionId: transactionId,
            Cvid: feedbackManagerState.conversationId,
        };

        if (extraData) {
            Object.keys(extraData).forEach(key => {
                jsonPropertyBagDictionary[key] = extraData[key];
            });
        }

        if (context) {
            // tslint:disable-next-line:no-string-literal
            jsonPropertyBagDictionary['Context'] = context;
        }

        let jsonPropertyBag = JSON.stringify(jsonPropertyBagDictionary);
        let targetList = JSON.stringify(entityIds);

        let entry: EntityFeedbackEntry = createEntityFeedbackEntry(
            feedbackManagerState,
            transactionId,
            'TransactionCompleted',
            targetList,
            EntityAddSource.None,
            jsonPropertyBag
        );

        attemptToSubmitAddEntityFeedback(feedbackManagerState, entry, false);

        trace.info(
            format(
                '{0} TransactionComplete. Session id: {1}',
                feedbackManagerState.entityScenarioName,
                feedbackManagerState.clientSessionId
            )
        );
    }
});
