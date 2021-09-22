import getKeywordSuggestions from './getKeywordSuggestions';
import getPeopleSuggestions from './getPeopleSuggestions';
import { MAX_SERVER_SUGGESTION_OF_KIND } from '../../searchConstants';
import getSuggestionQueryString from '../../selectors/getSuggestionQueryString';
import { SearchScenarioId, getScenarioStore } from 'owa-search-store';
import type { SuggestionSet } from 'owa-search-service';
import { getGuid } from 'owa-guid';

export default async function getLegacySuggestions(
    scenarioId: SearchScenarioId
): Promise<SuggestionSet> {
    const searchStore = getScenarioStore(scenarioId);
    const queryStringForSuggestions = getSuggestionQueryString(scenarioId);

    const keywordSuggestions = await getKeywordSuggestions(
        queryStringForSuggestions,
        searchStore.searchSessionGuid,
        MAX_SERVER_SUGGESTION_OF_KIND
    );

    const peopleSuggestions = await getPeopleSuggestions(
        queryStringForSuggestions,
        searchStore.searchSessionGuid,
        MAX_SERVER_SUGGESTION_OF_KIND,
        'gal'
    );

    const suggestions = await Promise.all([keywordSuggestions, peopleSuggestions]).then(
        suggestionSets => {
            // Merge sets of keyword and people suggestions into single set.
            return suggestionSets.reduce((accumulator, suggestionSet) =>
                accumulator.concat(suggestionSet)
            );
        }
    );

    return {
        Suggestions: suggestions,
        TraceId: getGuid(), // Assign a unique ID so we can differentiate between suggestion sets.
        IsComplete: true,
    };
}
