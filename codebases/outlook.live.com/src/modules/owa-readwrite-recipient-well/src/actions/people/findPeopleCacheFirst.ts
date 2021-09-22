import backfillCache from './backfillCache';
import postProcessSuggestionsResult from './postProcessSuggestionsResult';
import datapoints from '../../datapoints';
import store from '../../store/store';
import setIsSearching from '../setIsSearching';
import { DatapointStatus, PerformanceDatapoint, logUsage } from 'owa-analytics';
import { now } from 'owa-datetime';
import updateCurrentRenderedQueryString from '../updateCurrentRenderedQueryString';
import { populateFeedbackStateCache } from '../../utils/populateFeedbackState';
import processCacheResult from './processCacheResult';
import { getPeopleSuggestionsFromCache } from 'owa-recipient-cache/lib/actions/getPeopleSuggestionsFromCache';
import FindControlViewState, {
    FindResultType,
    DirectorySearchType,
} from 'owa-recipient-types/lib/types/FindControlViewState';
import type ReadWriteRecipientViewState from 'owa-recipient-types/lib/types/ReadWriteRecipientViewState';
import type RecipientWellWithFindControlViewState from 'owa-recipient-types/lib/types/RecipientWellWithFindControlViewState';
import getPersonasFromReadWriteRecipientList from 'owa-recipient-common/lib/utils/getPersonasFromReadWriteRecipientList';
import { isTrieCacheEnabled } from 'owa-substrate-people-suggestions/lib/utils/isTrieCacheEnabled';
import type PersonaType from 'owa-service/lib/contract/PersonaType';
import setFindResultSet from '../setFindResultSet';
import { getGuid } from 'owa-guid';
import { isFeatureEnabled } from 'owa-feature-flags';
import { FIND_PEOPLE_REQUEST_COUNT_THRESHOLD } from '../../utils/constants';

let getCacheResults = async (
    queryString: string,
    recipients: ReadWriteRecipientViewState[],
    recipientWell: FindControlViewState | RecipientWellWithFindControlViewState,
    appendResults: boolean,
    resolveIfSingle: boolean
): Promise<PersonaType[]> => {
    const transactionStartTime = now();
    let cacheResults = await getPeopleSuggestionsFromCache(
        queryString,
        getPersonasFromReadWriteRecipientList(recipients)
    );

    updateCurrentRenderedQueryString(recipientWell, queryString);
    const correlationId = getGuid();
    populateFeedbackStateCache(recipientWell, transactionStartTime, cacheResults, correlationId);

    processCacheResult(
        recipientWell,
        cacheResults,
        appendResults,
        resolveIfSingle,
        transactionStartTime
    );

    return cacheResults;
};

export default async function findPeopleCacheFirst(
    recipientWell: FindControlViewState | RecipientWellWithFindControlViewState,
    queryString: string,
    recipients: ReadWriteRecipientViewState[],
    appendResults: boolean,
    resolveIfSingle: boolean,
    scenario?: string,
    preventAutoSearchDirectory: boolean = false
): Promise<void> {
    // Initialization of variables
    let resultType: FindResultType = FindResultType.Cache;
    let datapoint: PerformanceDatapoint = new PerformanceDatapoint(
        datapoints.SearchCacheFirst.name
    );
    recipientWell.directorySearchType = DirectorySearchType.None;

    setIsSearching(recipientWell, true);

    // Try to find people using the cache
    let cacheResults = await getCacheResults(
        queryString,
        recipients,
        recipientWell,
        appendResults,
        resolveIfSingle
    );
    // There are available results if we were called with appendResults or the cache call was not empty
    let numberOfCacheResults = cacheResults.length;
    let resultsAvailable = appendResults || numberOfCacheResults > 0;
    logUsage('CacheFirstFindPeopleRequestCount', [store.pendingFindPeopleRequests]);
    try {
        if (
            resultsAvailable &&
            store.pendingFindPeopleRequests < FIND_PEOPLE_REQUEST_COUNT_THRESHOLD
        ) {
            // If there are cache results and we are under the people request threshold, append the results if the cache produced less than 5 results, and backfill the cache with the server results
            // We do not want to issue a live call if we are over the threshold limit, since we know the UI will display at least one result, we don't want to bog the service down if it is not necessary
            backfillCache(
                recipientWell,
                queryString,
                resolveIfSingle,
                !isTrieCacheEnabled() /*addToRecipientCache*/,
                resultsAvailable,
                scenario,
                preventAutoSearchDirectory
            );
            resultType = FindResultType.MixedCacheLive;
        } else if (!resultsAvailable) {
            // If there are no cache results, issue a live call regardless of the threshold limit in order to try and eventually show some results.
            // Backfill the cache with server results and update the UI with the server results
            let useFindPeopleRequestCountThreshold = isFeatureEnabled(
                'rp-useFindPeopleRequestCountThreshold'
            );

            if (
                store.pendingFindPeopleRequests < FIND_PEOPLE_REQUEST_COUNT_THRESHOLD ||
                !useFindPeopleRequestCountThreshold
            ) {
                await backfillCache(
                    recipientWell,
                    queryString,
                    resolveIfSingle,
                    !isTrieCacheEnabled() /*addToRecipientCache*/,
                    resultsAvailable,
                    scenario,
                    preventAutoSearchDirectory
                );
                // BackfillCache calls AD and already sets the findResultType
                resultType =
                    recipientWell.findResultType == FindResultType.SearchDirectory
                        ? FindResultType.SearchDirectory
                        : FindResultType.FindPeople;
            }
        }
    } catch (error) {
        if (!resultsAvailable) {
            // If there aren't any cache results available and the server has responded with error, clear the pane
            setFindResultSet(recipientWell, []);
        }
        datapoint.endWithError(DatapointStatus.ServerError, error);
    }

    if (recipientWell.findResultSet.length > 0) {
        postProcessSuggestionsResult(
            recipientWell,
            resultType,
            numberOfCacheResults,
            resolveIfSingle
        );
    }

    setIsSearching(recipientWell, false);

    // Instrument the result type in the datapoint
    datapoint.addCustomData([
        resultType /*resultType*/,
        queryString == recipientWell.queryString /*sameQueryString*/,
    ]);
    datapoint.end();
}
