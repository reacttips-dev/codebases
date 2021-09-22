import type { SubstrateSearchSuggestionsResponse } from 'owa-search-service';
import type FindPeopleResponseMessage from 'owa-service/lib/contract/FindPeopleResponseMessage';
import shouldUse3SPeopleSuggestions from 'owa-recipient-suggestions/lib/util/shouldUse3SPeopleSuggestions';

export default function getTransactionIdFromResponse(
    responseMessage: FindPeopleResponseMessage | SubstrateSearchSuggestionsResponse
): string {
    let transactionId = '';
    if (responseMessage) {
        if (shouldUse3SPeopleSuggestions()) {
            let response = responseMessage as SubstrateSearchSuggestionsResponse;
            if (response.Groups && response.Instrumentation) {
                transactionId = response.Instrumentation.TraceId;
            }
        } else {
            let response = responseMessage as FindPeopleResponseMessage;
            if (response.ResponseClass == 'Success' && response.ResultSet) {
                transactionId = response.TransactionId;
            }
        }
    }

    return transactionId;
}
