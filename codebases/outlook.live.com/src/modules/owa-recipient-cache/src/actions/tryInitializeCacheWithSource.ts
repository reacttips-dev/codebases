import getKeyForSuggestion from 'owa-3s-local/lib/actions/getKeyForSuggestion';
import type { InitializeCacheState } from './initializeCache';
import datapoints from '../datapoints';
import { findPeople } from '../services/findPeople';
import substrateSuggestion from '../services/substrateSuggestion';
import { RecipientCacheSource } from '../store/schema/RecipientCacheSource';
import { mutatorAction } from 'satcheljs';
import createFindPeopleFeedbackManager from 'owa-controls-findpeople-feedback-manager/lib/actions/createFindPeopleFeedbackManager';
import transactionFailed from 'owa-controls-findpeople-feedback-manager/lib/actions/transactionFailed';
import { OwaDate, now } from 'owa-datetime';
import setFallbackToFindPeople from 'owa-recipient-suggestions/lib/actions/setFallbackToFindPeople';
import convertSuggestionToPersonaType from 'owa-recipient-suggestions/lib/util/convertSuggestionToPersonaType';
import getTransactionIdFromResponse from 'owa-recipient-common/lib/utils/getTransactionIdFromResponse';
import type { SubstrateSearchSuggestionsResponse } from 'owa-search-service';
import type PersonaType from 'owa-service/lib/contract/PersonaType';
import { trace } from 'owa-trace';
import { isTrieCacheEnabled } from 'owa-substrate-people-suggestions/lib/utils/isTrieCacheEnabled';
import { PersonSource } from 'owa-substrate-people-suggestions/lib/store/schema/PersonSource';
import { lazyInitializeSuggestionTrie } from 'owa-3s-local';
import { logUsage, wrapFunctionForDatapoint } from 'owa-analytics';
import { getGuid } from 'owa-guid';
import { isFeatureEnabled } from 'owa-feature-flags';

const CONTEXT = {
    Action: 'Type Down',
};

export default wrapFunctionForDatapoint(
    datapoints.RecipientCacheInitialization,
    async function tryInitializeCacheWithSource(
        source: RecipientCacheSource,
        fallback: boolean /* used for datapoints, used to track whether we had to use the fallback method to populate the cache */,
        state?: InitializeCacheState
    ): Promise<void> {
        const transactionStart = now();
        let transactionId = '';
        try {
            let cacheResults: PersonaType[];

            let cvid: string;
            if (isFeatureEnabled('rp-enableZqFvlJoin')) {
                cvid = getGuid();
            }
            switch (source) {
                case RecipientCacheSource.SubstrateSuggestions:
                    const substrateSuggestionResult = await substrateSuggestion(cvid);
                    cacheResults = convert3SResultsToPersonaType(substrateSuggestionResult);
                    transactionId = getTransactionIdFromResponse(substrateSuggestionResult);
                    break;
                case RecipientCacheSource.FindPeople:
                    const findPeopleResult = await findPeople();
                    cacheResults = findPeopleResult.ResultSet;
                    transactionId = getTransactionIdFromResponse(findPeopleResult);
                    break;
            }

            if (fallback) {
                setFallbackToFindPeople(true);
            }

            processCacheCallResults(cacheResults, state, source, fallback, cvid);
        } catch (error) {
            trace.warn(error.message);
            addTransactionFailed(transactionStart, transactionId);
            logUsage('tryInitializeCacheWithSourceError', [error.Name]);
        }
    }
);

const processCacheCallResults = mutatorAction(
    'processCacheCallResults',
    (
        cacheResults: PersonaType[],
        state: InitializeCacheState,
        source: RecipientCacheSource,
        fallback: boolean,
        cvid?: string
    ) => {
        if (cacheResults && cacheResults.length > 0) {
            cacheResults.forEach(x => {
                let suggestionKey = getKeyForSuggestion(x);
                if (suggestionKey) {
                    state.store.allKeys[suggestionKey] = true;
                }
            });
            state.store.recipientCache = cacheResults;
            if (cvid) {
                state.store.cvid = cvid;
            }

            if (
                isTrieCacheEnabled() &&
                source == RecipientCacheSource.SubstrateSuggestions &&
                !fallback
            ) {
                let trieSuggestion = [...cacheResults];
                let filterSuggestions = filterFreshSuggestion(cacheResults);
                state.store.recipientCache = filterSuggestions;

                lazyInitializeSuggestionTrie.importAndExecute(trieSuggestion);
            }
        }
    }
);

function filterFreshSuggestion(cacheResults: PersonaType[]): PersonaType[] {
    // https://o365exchange.visualstudio.com/O365%20Core/_search?action=contents&text=PersonSuggestionSource&type=code&lp=code-Project&filters=ProjectFilters%7BO365%20Core%7DRepositoryFilters%7BGriffin%7D&pageSize=25&result=DefaultCollection%2FO365%20Core%2FGriffin%2FGBmaster%2F%2Fsources%2Fdev%2FSubstrateSearch%2Fsrc%2FEntityServe%2FRelevance%2FPeople%2FPersonSuggestionSource.cs
    // People Source = 7 is FreshIndex suggestion, which we do not want to add to the cache
    return cacheResults.filter(x => x.FeatureData['PeopleSource'] != PersonSource.FreshIndex);
}

function convert3SResultsToPersonaType(resp: SubstrateSearchSuggestionsResponse): PersonaType[] {
    let personaTypeSet: PersonaType[] = [];

    if (!resp || !resp.Groups) {
        trace.warn('Response groups should not be null');
    } else {
        const transactionId = resp.Instrumentation?.TraceId;
        for (const group of resp.Groups) {
            if (group.Type === 'People') {
                personaTypeSet = group.Suggestions.map(suggestion => {
                    return convertSuggestionToPersonaType(suggestion, transactionId);
                });
                break;
            }
        }
    }

    return personaTypeSet;
}

function addTransactionFailed(transactionStartTime: OwaDate, transactionId: string): void {
    transactionFailed(
        createFindPeopleFeedbackManager(),
        '' /*queryString*/,
        transactionId,
        transactionStartTime,
        CONTEXT
    );
}
