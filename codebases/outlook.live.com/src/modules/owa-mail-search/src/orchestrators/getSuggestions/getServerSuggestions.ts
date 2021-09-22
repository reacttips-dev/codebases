import getLegacySuggestions from './getLegacySuggestions';
import getSubstrateSuggestions from './getSubstrateSuggestions';
import { is3SServiceAvailable } from 'owa-search';
import type { SearchScenarioId } from 'owa-search-store';
import getSuggestionQueryString from '../../selectors/getSuggestionQueryString';
import type { SuggestionSet } from 'owa-search-service';

export default async function getServerSuggestions(
    scenarioId: SearchScenarioId,
    queryStringForSuggestions: string
): Promise<SuggestionSet> {
    // Return legacy suggestions if QF is not available.
    if (!is3SServiceAvailable()) {
        return getLegacySuggestions(scenarioId);
    }

    const suggestionSet = await getSubstrateSuggestions(scenarioId);

    if (queryStringForSuggestions != getSuggestionQueryString(scenarioId)) {
        // do not proceed if after the 3S suggestions calls returns,
        // user has moved on to a different query string
        return suggestionSet;
    }

    return {
        Suggestions: suggestionSet.Suggestions,
        TraceId: suggestionSet.TraceId,
        IsComplete: true,
        RequestStart: suggestionSet.RequestStart,
    };
}
