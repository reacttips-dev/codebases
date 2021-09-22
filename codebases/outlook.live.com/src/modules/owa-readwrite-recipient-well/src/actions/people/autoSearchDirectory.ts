import { action } from 'satcheljs/lib/legacy';
import { lazySearchSuggestions } from 'owa-recipient-suggestions';
import postProcessSuggestionsResult from './postProcessSuggestionsResult';
import processResponseResults from './processResponseResults';
import {
    populateFeedbackStateNetwork,
    updateFeedbackStateNetwork,
} from '../../utils/populateFeedbackState';
import setIsSearching from '../setIsSearching';
import updateCurrentRenderedQueryString from '../updateCurrentRenderedQueryString';
import getTransactionIdFromResponse from 'owa-recipient-common/lib/utils/getTransactionIdFromResponse';
import { now } from 'owa-datetime';
import { getGuid } from 'owa-guid';
import FindControlViewState, {
    FindResultType,
    DirectorySearchType,
} from 'owa-recipient-types/lib/types/FindControlViewState';
import addTransactionComplete from 'owa-recipient-common/lib/utils/addTransactionComplete';
import SubstrateSearchScenario from 'owa-search-service/lib/data/schema/SubstrateSearchScenario';
import addResponseReceived from 'owa-recipient-common/lib/utils/addResponseReceived';

const MAX_ENTRIES_DIRECTORY = 20;

export default action('autoSearchDirectory')(function autoSearchDirectory(
    recipientWell: FindControlViewState,
    queryString: string,
    resolveIfSingle?: boolean,
    appendResults?: boolean,
    scenario?: string
): Promise<void> {
    let transactionStartTime = now();
    const clientRequestId = getGuid();
    // Record the beginning of the live call
    // in case the live call hangs and the user submits feedback before it returns
    populateFeedbackStateNetwork(
        recipientWell,
        transactionStartTime,
        clientRequestId,
        true /*directory*/
    );

    return lazySearchSuggestions
        .import()
        .then(getSuggestions =>
            getSuggestions(
                recipientWell.userIdentity,
                queryString,
                true /*searchDirectory*/,
                clientRequestId,
                recipientWell.findPeopleFeedbackManager,
                null /*currentRecipients*/,
                scenario
            )
        )
        .then(response => {
            setIsSearching(recipientWell, false);
            let sameQueryString = recipientWell.queryString.trim() == queryString;

            if (sameQueryString) {
                let maxFindResultShown = MAX_ENTRIES_DIRECTORY;
                updateCurrentRenderedQueryString(recipientWell, queryString);
                processResponseResults(
                    recipientWell.findResultSet,
                    response,
                    clientRequestId,
                    appendResults,
                    maxFindResultShown,
                    true /*returnMaskedRecipients*/
                );

                const traceId = getTransactionIdFromResponse(response);

                addResponseReceived(
                    SubstrateSearchScenario.MailCompose,
                    traceId,
                    transactionStartTime,
                    200 /*status*/
                );

                updateFeedbackStateNetwork(recipientWell, true /*directory*/, traceId, response);

                addTransactionComplete(
                    recipientWell.findResultSet,
                    recipientWell,
                    transactionStartTime,
                    traceId
                );

                recipientWell.directorySearchType = DirectorySearchType.Auto;
                /* manually trigger rerender if the response has 0 elements */
                if (recipientWell.findResultSet.length == 0) {
                    recipientWell.findResultSet = [];
                }
                postProcessSuggestionsResult(
                    recipientWell,
                    FindResultType.SearchDirectory,
                    0 /* numberOfCacheResults*/,
                    resolveIfSingle
                );
            }
        });
});
