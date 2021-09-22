import postProcessSuggestionsResult from './postProcessSuggestionsResult';
import setFindResultSet from '../setFindResultSet';
import setIsSearching from '../setIsSearching';
import removeDuplicateResultsFromCacheResults from '../../utils/removeDuplicateResultsFromCacheResults';
import FindControlViewState, {
    FindResultType,
} from 'owa-recipient-types/lib/types/FindControlViewState';
import type FindRecipientPersonaType from 'owa-recipient-types/lib/types/FindRecipientPersonaType';
import type RecipientWellWithFindControlViewState from 'owa-recipient-types/lib/types/RecipientWellWithFindControlViewState';
import addLocalCacheTransactionComplete from 'owa-recipient-common/lib/utils/addLocalCacheTransactionComplete';
import type PersonaType from 'owa-service/lib/contract/PersonaType';
import { action } from 'satcheljs/lib/legacy';
import type { OwaDate } from 'owa-datetime';

const MAX_RESULTS = 5;

export default action('processCacheResult')(function processCacheResult(
    recipientWell: FindControlViewState | RecipientWellWithFindControlViewState,
    cacheResults: PersonaType[],
    appendResults: boolean,
    resolveIfSingle: boolean,
    transactionStartTime: OwaDate
) {
    if (appendResults) {
        const currentResultsMap = new Map<string, FindRecipientPersonaType>();
        recipientWell.findResultSet.forEach(value => {
            currentResultsMap[value.EmailAddress.EmailAddress] = value;
        });
        cacheResults = removeDuplicateResultsFromCacheResults(currentResultsMap, cacheResults);

        cacheResults = [...recipientWell.findResultSet, ...cacheResults];
        cacheResults.splice(MAX_RESULTS);
    }
    setIsSearching(recipientWell, false);

    if (appendResults || cacheResults.length > 0) {
        // Only update the well if there have been results or appendResults is set to true
        // as this indicates that there are prioritized results in the recipient well.
        setFindResultSet(recipientWell, cacheResults as FindRecipientPersonaType[]);
    }

    addLocalCacheTransactionComplete(recipientWell, transactionStartTime);
    postProcessSuggestionsResult(
        recipientWell,
        FindResultType.Cache,
        cacheResults.length,
        resolveIfSingle
    );
});
