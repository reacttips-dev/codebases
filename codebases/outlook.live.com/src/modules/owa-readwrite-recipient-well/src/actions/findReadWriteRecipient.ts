import autoSearchDirectory from './people/autoSearchDirectory';
import findPeopleCacheFirst from './people/findPeopleCacheFirst';
import postProcessSuggestionsResult from './people/postProcessSuggestionsResult';
import processResponseResults from './people/processResponseResults';
import setIsSearching from './setIsSearching';
import updateCurrentRenderedQueryString from './updateCurrentRenderedQueryString';
import { addPendingRequest, removePendingRequest } from './updatePendingRequestActions';
import datapoints from '../datapoints';
import type ReadWriteRecipientWellStore from '../store/schema/ReadWriteRecipientWellStore';
import recipientWellStore from '../store/store';
import getPrioritizedResults from '../utils/getPrioritizedResults';
import tryGetRecipientsFromViewState from '../utils/tryGetRecipientsFromViewState';
import { DatapointStatus, PerformanceDatapoint } from 'owa-analytics';
import { now } from 'owa-datetime';
import { isFeatureEnabled } from 'owa-feature-flags';
import { getGuid } from 'owa-guid';
import processCacheResult from './people/processCacheResult';
import { getPeopleSuggestionsFromCache } from 'owa-recipient-cache/lib/actions/getPeopleSuggestionsFromCache';
import isCacheEmpty from 'owa-recipient-cache/lib/utils/isCacheEmpty';
import addTransactionComplete from 'owa-recipient-common/lib/utils/addTransactionComplete';
import addTransactionFailed from 'owa-recipient-common/lib/utils/addTransactionFailed';
import getPersonasFromReadWriteRecipientList from 'owa-recipient-common/lib/utils/getPersonasFromReadWriteRecipientList';
import getTransactionIdFromResponse from 'owa-recipient-common/lib/utils/getTransactionIdFromResponse';
import { lazySearchSuggestions } from 'owa-recipient-suggestions';
import shouldUse3SPeopleSuggestions from 'owa-recipient-suggestions/lib/util/shouldUse3SPeopleSuggestions';
import FindControlViewState, {
    FindResultType,
    DirectorySearchType,
} from 'owa-recipient-types/lib/types/FindControlViewState';
import type ReadWriteRecipientViewState from 'owa-recipient-types/lib/types/ReadWriteRecipientViewState';
import type RecipientWellWithFindControlViewState from 'owa-recipient-types/lib/types/RecipientWellWithFindControlViewState';
import { isConsumer } from 'owa-session-store';
import {
    resetFeedbackState,
    populateFeedbackStateNetwork,
    populateFeedbackStateCache,
    updateFeedbackStateNetwork,
} from '../utils/populateFeedbackState';
import {
    FIND_PEOPLE_REQUEST_COUNT_THRESHOLD,
    MAX_ENTRIES_TYPEDOWN,
    MAX_ENTRIES_DIRECTORY,
} from '../utils/constants';
import { getServiceTimeout } from './people/getServiceTimeout';
import { isCacheFirstEnabled } from './people/isCacheFirstEnabled';
import { updateRecipientWellDirectorySearchType } from './updateRecipientWellDirectorySearchType';
import { updateRecipientWellFindResultSet } from './updateRecipientWellFindResultSet';
import type FindRecipientPersonaType from 'owa-recipient-types/lib/types/FindRecipientPersonaType';
import { lazyIsSuggestionTrieEmpty } from 'owa-3s-local';
import { isTrieCacheEnabled } from 'owa-substrate-people-suggestions/lib/utils/isTrieCacheEnabled';
import SubstrateSearchScenario from 'owa-search-service/lib/data/schema/SubstrateSearchScenario';
import addResponseReceived from 'owa-recipient-common/lib/utils/addResponseReceived';
import rcStore from 'owa-recipient-cache/lib/store/store';

interface TimeOutCheck {
    isTimedOut: boolean;
    isCacheEmpty: boolean;
}

let handleLongDelay = (
    recipientWell: FindControlViewState,
    recipients: ReadWriteRecipientViewState[],
    queryString: string,
    appendResults: boolean,
    resolveIfSingle: boolean,
    didTimeOut: TimeOutCheck
) => async () => {
    didTimeOut.isTimedOut = true;
    await searchCacheFallback(
        recipientWell,
        queryString,
        recipients,
        appendResults,
        resolveIfSingle,
        didTimeOut
    );
};

let searchCacheFallback = async function searchCacheFallback(
    recipientWell: FindControlViewState,
    queryString: string,
    recipients: ReadWriteRecipientViewState[],
    appendResults: boolean,
    resolveIfSingle: boolean,
    didTimeOut?: TimeOutCheck
): Promise<void> {
    if (recipientWell.queryString.trim() == queryString.trim()) {
        const transactionStartTime = now();
        let cacheResults = await getPeopleSuggestionsFromCache(
            queryString,
            getPersonasFromReadWriteRecipientList(recipients)
        );

        populateFeedbackStateCache(
            recipientWell,
            transactionStartTime,
            cacheResults,
            getGuid(),
            true /*fallback*/
        );

        updateCurrentRenderedQueryString(recipientWell, queryString);
        updateRecipientWellDirectorySearchType(recipientWell, DirectorySearchType.None);

        if (cacheResults.length > 0) {
            processCacheResult(
                recipientWell,
                cacheResults,
                appendResults,
                resolveIfSingle,
                transactionStartTime
            );
        } else if (didTimeOut) {
            didTimeOut.isCacheEmpty = true;
        }
    }
};

export interface ReadWriteRecipientWellStoreState {
    store: ReadWriteRecipientWellStore;
}

export default async function findReadWriteRecipient(
    recipientWell: FindControlViewState | RecipientWellWithFindControlViewState,
    queryString: string,
    searchDirectory: boolean,
    resolveIfSingle?: boolean,
    recipientsToExclude?: ReadWriteRecipientViewState[],
    recipientsToPrioritize?: ReadWriteRecipientViewState[],
    searchCacheFirstOverride?: boolean,
    scenario?: string,
    state: ReadWriteRecipientWellStoreState = { store: recipientWellStore },
    preventAutoSearchDirectory: boolean = false
): Promise<void> {
    if (!searchDirectory) {
        // If this is searching directory we don't want to reset the feedback state since it should be a part of the same query
        resetFeedbackState(recipientWell);
    }
    let recipients = tryGetRecipientsFromViewState(recipientWell, recipientsToExclude);
    let appendResults = false;
    if (recipientsToPrioritize && recipientsToPrioritize.length > 0) {
        const prioritizedResults = getPrioritizedResults(queryString, recipientsToPrioritize);
        if (prioritizedResults && prioritizedResults.length > 0) {
            updateRecipientWellFindResultSet(recipientWell, prioritizedResults);
            appendResults = true;
        }
    }
    let isCachePopulated =
        !isCacheEmpty() &&
        (!isTrieCacheEnabled() || !(await lazyIsSuggestionTrieEmpty.importAndExecute()));
    // If cache-first  flights are enabled, we query the cache first, backfill from the server and query AD if needed

    // Still use cache if userIdentity is not populated
    let useCache =
        !recipientWell?.userIdentity ||
        !rcStore?.userIdentity ||
        recipientWell.userIdentity == rcStore.userIdentity;
    if (
        (searchCacheFirstOverride || isCacheFirstEnabled()) &&
        !searchDirectory &&
        isCachePopulated &&
        useCache
    ) {
        await findPeopleCacheFirst(
            recipientWell,
            queryString,
            recipients,
            appendResults,
            resolveIfSingle,
            scenario,
            preventAutoSearchDirectory
        );
        return;
    }
    let didAutoSearchDirectory = false;
    // If the pending FP request threshold has not been hit
    // Continue with normal find people call
    // Otherwise fallback to searching the cache
    if (state.store.pendingFindPeopleRequests < FIND_PEOPLE_REQUEST_COUNT_THRESHOLD) {
        let datapoint: PerformanceDatapoint = new PerformanceDatapoint(
            datapoints.SearchPeopleIndex.name
        );
        setIsSearching(recipientWell, true);
        /* The EPP only re-renders when suggestions are changed
           However, we want it to rerender here to show the searching state in the footer
           so resetting the suggestions to be the existing suggestions so that the control re-renders */
        updateRecipientWellFindResultSet(recipientWell, [...recipientWell.findResultSet]);
        /* If this is a Mailbox query, the current query returned 0 results, and the new query is additive, automatically issue a mailbox and directory request */
        const { currentRenderedQueryString, directorySearchType } = recipientWell;
        if (
            isFeatureEnabled('rp-optimizeAutoSearchDirectory') &&
            currentRenderedQueryString != '' &&
            !searchDirectory &&
            directorySearchType == DirectorySearchType.Auto &&
            currentRenderedQueryString.length < queryString.length &&
            queryString.indexOf(recipientWell.currentRenderedQueryString) == 0 &&
            !preventAutoSearchDirectory
        ) {
            await autoSearchDirectory(
                recipientWell,
                queryString,
                resolveIfSingle,
                null /*appendResults*/,
                scenario
            );
            didAutoSearchDirectory = true;
            datapoint.addCustomData([
                false /*isTimedOut*/,
                true /*isSameQueryString*/,
                true /*searchDirectory*/,
                false /*isCacheEmpty*/,
                true /*didAutoSearchDirectory*/,
                shouldUse3SPeopleSuggestions(),
            ]);
            datapoint.end();
        } else {
            updateCurrentRenderedQueryString(recipientWell, queryString);
            let didTimeOut: TimeOutCheck = { isTimedOut: false, isCacheEmpty: false };
            let timeout =
                searchDirectory || isCacheEmpty()
                    ? null
                    : setTimeout(
                          handleLongDelay(
                              recipientWell,
                              recipients,
                              queryString,
                              appendResults,
                              resolveIfSingle,
                              didTimeOut
                          ),
                          getServiceTimeout()
                      );
            let transactionStartTime = now();
            let transactionId = '';
            const correlationId = getGuid();
            try {
                addPendingRequest(correlationId);
                let currentRecipients: string[] = [];
                // Add each recipient email addresses to the response
                recipients.forEach(item => {
                    currentRecipients.push(item.persona.EmailAddress.EmailAddress);
                });
                // Record the beginning of the live call
                // in case the live call hangs and the user submits feedback before it returns
                populateFeedbackStateNetwork(
                    recipientWell,
                    transactionStartTime,
                    correlationId,
                    searchDirectory
                );
                let response = await lazySearchSuggestions
                    .import()
                    .then(suggestionService =>
                        suggestionService(
                            recipientWell.userIdentity,
                            queryString,
                            searchDirectory,
                            correlationId,
                            recipientWell.findPeopleFeedbackManager,
                            currentRecipients,
                            scenario,
                            isCachePopulated
                        )
                    );
                removePendingRequest(correlationId);
                clearTimeout(timeout);
                let sameQueryString = recipientWell.queryString == queryString;
                // Only update and show find result if:
                // FP has not timed out or the cache results were empty
                // And the query string hasn't been changed.
                // If it has been changed, another findpeople call would have been issued
                // and we can let its callback handle update and show find result.
                if ((!didTimeOut.isTimedOut || didTimeOut.isCacheEmpty) && sameQueryString) {
                    transactionId = getTransactionIdFromResponse(response);
                    updateFeedbackStateNetwork(
                        recipientWell,
                        searchDirectory,
                        transactionId,
                        response
                    );

                    updateRecipientWellDirectorySearchType(
                        recipientWell,
                        searchDirectory ? DirectorySearchType.Manual : DirectorySearchType.None
                    );

                    let maxFindResultShown = searchDirectory
                        ? MAX_ENTRIES_DIRECTORY
                        : MAX_ENTRIES_TYPEDOWN;
                    processResponseResults(
                        recipientWell.findResultSet,
                        response,
                        correlationId,
                        appendResults,
                        maxFindResultShown,
                        searchDirectory /*returnMaskedRecipients*/
                    );
                    addResponseReceived(
                        SubstrateSearchScenario.MailCompose,
                        transactionId,
                        transactionStartTime,
                        200 /*status*/
                    );
                    addTransactionComplete(
                        recipientWell.findResultSet as FindRecipientPersonaType[],
                        recipientWell,
                        transactionStartTime,
                        transactionId
                    );
                    // If we got results, proceed as normal, otherwise check the cache before auto search the directory
                    if (recipientWell.findResultSet.length > 0) {
                        setIsSearching(recipientWell, false);
                        let resultType = searchDirectory
                            ? FindResultType.SearchDirectory
                            : FindResultType.FindPeople;
                        postProcessSuggestionsResult(
                            recipientWell,
                            resultType,
                            0 /* numberOfCacheResults*/,
                            resolveIfSingle
                        );
                    } else {
                        // Check the local cache before falling back to the directory.
                        await searchCacheFallback(
                            recipientWell,
                            queryString,
                            recipients,
                            appendResults,
                            resolveIfSingle
                        );
                        if (
                            recipientWell.findResultSet.length === 0 &&
                            !preventAutoSearchDirectory
                        ) {
                            if (isConsumer()) {
                                // We only want to search the directory if the user is an enterprise user
                                // Since Consumer users will not get more results from Directory
                                // If Mailbox is already returning 0, simulate that we have already searched for more
                                // Also explicity set the findResultSet to force a re-render
                                updateRecipientWellDirectorySearchType(
                                    recipientWell,
                                    DirectorySearchType.Auto,
                                    true
                                );
                            } else {
                                didAutoSearchDirectory = true;
                                await autoSearchDirectory(
                                    recipientWell,
                                    queryString,
                                    resolveIfSingle,
                                    null /*appendResults*/,
                                    scenario
                                );
                            }
                        }
                    }
                }
                if (didTimeOut.isTimedOut) {
                    addResponseReceived(
                        SubstrateSearchScenario.MailCompose,
                        correlationId,
                        transactionStartTime,
                        408 /*timeout status*/,
                        getServiceTimeout()
                    );
                }
                datapoint.addCustomData([
                    didTimeOut.isTimedOut,
                    sameQueryString,
                    searchDirectory,
                    didTimeOut.isCacheEmpty,
                    didAutoSearchDirectory,
                    shouldUse3SPeopleSuggestions(),
                ]);
                datapoint.end();
            } catch (error) {
                removePendingRequest(correlationId);
                datapoint.endWithError(DatapointStatus.ServerError, error);
                addResponseReceived(
                    SubstrateSearchScenario.MailCompose,
                    correlationId,
                    transactionStartTime,
                    error.responseCode
                );
                addTransactionFailed(recipientWell, transactionStartTime, transactionId);
                await searchCacheFallback(
                    recipientWell,
                    queryString,
                    recipients,
                    appendResults,
                    resolveIfSingle
                );
            }
        }
    } else {
        let datapoint: PerformanceDatapoint = new PerformanceDatapoint('FindPeopleThresholdHit');
        await searchCacheFallback(
            recipientWell,
            queryString,
            recipients,
            appendResults,
            resolveIfSingle
        );
        datapoint.end();
    }
    setIsSearching(recipientWell, false);
}
