import processResponseResults from './processResponseResults';
import autoSearchDirectory from './autoSearchDirectory';
import getTransactionIdFromResponse from 'owa-recipient-common/lib/utils/getTransactionIdFromResponse';
import { lazySearchSuggestions } from 'owa-recipient-suggestions';
import { addPendingRequest, removePendingRequest } from '../updatePendingRequestActions';
import { now } from 'owa-datetime';
import { getGuid } from 'owa-guid';
import addToCache from 'owa-recipient-cache/lib/actions/addToCache';
import processSubstrateSuggestionsResponse from 'owa-recipient-common/lib/actions/processSubstrateSuggestionsResponse';
import FindControlViewState, {
    DirectorySearchType,
} from 'owa-recipient-types/lib/types/FindControlViewState';
import type RecipientWellWithFindControlViewState from 'owa-recipient-types/lib/types/RecipientWellWithFindControlViewState';
import addTransactionComplete from 'owa-recipient-common/lib/utils/addTransactionComplete';
import addTransactionFailed from 'owa-recipient-common/lib/utils/addTransactionFailed';
import type { SubstrateSearchSuggestionsResponse } from 'owa-search-service';
import type FindPeopleResponseMessage from 'owa-service/lib/contract/FindPeopleResponseMessage';
import type PersonaType from 'owa-service/lib/contract/PersonaType';
import shouldUse3SPeopleSuggestions from 'owa-recipient-suggestions/lib/util/shouldUse3SPeopleSuggestions';
import {
    populateFeedbackStateNetwork,
    updateFeedbackStateNetwork,
} from '../../utils/populateFeedbackState';
import setDirectorySearchType from '../setDirectorySearchType';
import { lazyCompareFeatureData } from 'owa-3s-local';
import { isTrieCacheEnabled } from 'owa-substrate-people-suggestions/lib/utils/isTrieCacheEnabled';
import type FindRecipientPersonaType from 'owa-recipient-types/lib/types/FindRecipientPersonaType';
import SubstrateSearchScenario from 'owa-search-service/lib/data/schema/SubstrateSearchScenario';
import addResponseReceived from 'owa-recipient-common/lib/utils/addResponseReceived';
import { isConsumer } from 'owa-session-store';
import updateCurrentRenderedQueryString from '../updateCurrentRenderedQueryString';
import { logUsage } from 'owa-analytics';
import { isFeatureEnabled } from 'owa-feature-flags';

const MAX_ENTRIES_TYPEDOWN = 5;

export default async function backfillCache(
    recipientWell: FindControlViewState | RecipientWellWithFindControlViewState,
    queryString: string,
    resolveIfSingle: boolean,
    addToRecipientCache: boolean,
    cacheResultsAvailable: boolean,
    scenario?: string,
    preventAutoSearchDirectory: boolean = false
): Promise<void> {
    const correlationId = getGuid();
    addPendingRequest(correlationId);
    let transactionStartTime = now();
    // Record the beginning of the live call
    // in case the live call hangs and the user submits feedback before it returns
    populateFeedbackStateNetwork(
        recipientWell,
        transactionStartTime,
        correlationId,
        false /*isDirectory*/
    );
    let transactionId = '';
    updateCurrentRenderedQueryString(recipientWell, queryString);

    try {
        const serverResults = await lazySearchSuggestions
            .import()
            .then(getSuggestions =>
                getSuggestions(
                    recipientWell.userIdentity,
                    queryString,
                    false /*searchDirectory*/,
                    correlationId,
                    recipientWell.findPeopleFeedbackManager /*feedbackManager*/,
                    null /*currentRecipients*/,
                    scenario
                )
            );
        transactionId = getTransactionIdFromResponse(serverResults);

        const resultSet = getPersonaResults(serverResults, correlationId);

        if (addToRecipientCache) {
            // Backfill the cache with server results
            addToCache(resultSet);
        }

        if (recipientWell.queryString != queryString) {
            return;
        }

        let comparisonInfo = '';
        let serverResultsEmpty = isServerResultEmpty(serverResults);
        if (isTrieCacheEnabled() && cacheResultsAvailable && !serverResultsEmpty) {
            try {
                comparisonInfo = await lazyCompareFeatureData
                    .import()
                    .then(compareFeatureData =>
                        compareFeatureData(
                            recipientWell.findResultSet,
                            serverResults as SubstrateSearchSuggestionsResponse
                        )
                    );
            } catch (error) {
                logUsage('compareFeatureData', [error.Name]);
            }
        }

        updateFeedbackStateNetwork(
            recipientWell,
            false /*isDirectory*/,
            transactionId,
            serverResults,
            comparisonInfo
        );

        // Process the response results to update the UI. If the UI already has cache results for this query, this will append the server results to the end of the list.
        // Otherwise it will clear out the existing find result set (from a previous query) and replace with the live results
        processResponseResults(
            recipientWell.findResultSet,
            serverResults,
            correlationId,
            cacheResultsAvailable,
            MAX_ENTRIES_TYPEDOWN,
            false /*returnMaskedRecipients*/,
            isFeatureEnabled('rp-enableCsrFvlJoin') /*updateCacheResults*/
        );

        // If there are server results, just use the server results
        if (serverResultsEmpty && !preventAutoSearchDirectory) {
            if (!isConsumer()) {
                // If there are still no results, then query AD
                await autoSearchDirectory(
                    recipientWell,
                    queryString,
                    resolveIfSingle,
                    cacheResultsAvailable /*appendResults*/,
                    scenario
                );
            } else {
                // We only want to search the directory if the user is an enterprise user
                // Since Consumer users will not get more results from Directory
                // If Mailbox is already returning 0, simulate that we have already searched for more
                setDirectorySearchType(recipientWell, DirectorySearchType.Auto);

                /* manually trigger rerender if the response has 0 elements */
                if (recipientWell.findResultSet.length == 0) {
                    recipientWell.findResultSet = [];
                }
            }
        }

        addResponseReceived(
            SubstrateSearchScenario.MailCompose,
            transactionId,
            transactionStartTime,
            200 /*status*/
        );

        addTransactionComplete(
            resultSet as FindRecipientPersonaType[],
            recipientWell,
            transactionStartTime,
            transactionId
        );
    } catch (error) {
        addResponseReceived(
            SubstrateSearchScenario.MailCompose,
            correlationId,
            transactionStartTime,
            error.responseCode /*status*/
        );

        addTransactionFailed(recipientWell, transactionStartTime, transactionId);
        throw error;
    } finally {
        removePendingRequest(correlationId);
    }
}

export function getPersonaResults(
    serverResult: FindPeopleResponseMessage | SubstrateSearchSuggestionsResponse,
    correlationId: string
): PersonaType[] {
    if (shouldUse3SPeopleSuggestions()) {
        let personas = [];
        processSubstrateSuggestionsResponse(
            personas,
            serverResult as SubstrateSearchSuggestionsResponse,
            correlationId,
            false
        );
        return personas;
    } else {
        return (serverResult as FindPeopleResponseMessage).ResultSet;
    }
}

function isServerResultEmpty(
    serverResult: FindPeopleResponseMessage | SubstrateSearchSuggestionsResponse
): boolean {
    if (shouldUse3SPeopleSuggestions()) {
        const result = serverResult as SubstrateSearchSuggestionsResponse;
        return !result?.Groups?.length;
    } else {
        const result = serverResult as FindPeopleResponseMessage;
        return result.ResponseClass != 'Success' || result.ResultSet.length == 0;
    }
}
