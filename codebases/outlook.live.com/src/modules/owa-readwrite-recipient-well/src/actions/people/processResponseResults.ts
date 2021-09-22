import processSubstrateSuggestionsResponse from 'owa-recipient-common/lib/actions/processSubstrateSuggestionsResponse';
import removeDuplicateResultsFromResponseAndUpdateRefId from '../../utils/removeDuplicateResultsFromResponse';
import processFindPeopleResult from 'owa-recipient-common/lib/actions/processFindPeopleResult';
import type FindRecipientPersonaType from 'owa-recipient-types/lib/types/FindRecipientPersonaType';
import type { SubstrateSearchSuggestionsResponse } from 'owa-search-service';
import type FindPeopleResponseMessage from 'owa-service/lib/contract/FindPeopleResponseMessage';
import shouldUse3SPeopleSuggestions from 'owa-recipient-suggestions/lib/util/shouldUse3SPeopleSuggestions';
import { action } from 'satcheljs/lib/legacy';

export default action('processResponseResults')(function processResponseResults(
    resultList: FindRecipientPersonaType[],
    response: any,
    correlationId: string,
    appendResults: boolean,
    maxResults?: number,
    returnMaskedRecipients?: boolean,
    updateRefIds?: boolean
) {
    if (appendResults) {
        const currentResultsMap = new Map<string, FindRecipientPersonaType>();
        resultList.forEach(value => {
            currentResultsMap[value.EmailAddress.EmailAddress] = value;
        });

        removeDuplicateResultsFromResponseAndUpdateRefId(
            currentResultsMap,
            response,
            resultList,
            updateRefIds
        );
    }

    if (shouldUse3SPeopleSuggestions()) {
        processSubstrateSuggestionsResponse(
            resultList,
            response as SubstrateSearchSuggestionsResponse,
            correlationId,
            appendResults,
            maxResults,
            returnMaskedRecipients
        );
    } else {
        processFindPeopleResult(
            resultList,
            response as FindPeopleResponseMessage,
            appendResults,
            maxResults
        );
    }
});
