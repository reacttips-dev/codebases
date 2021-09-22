import { SearchScenarioId, getScenarioStore } from 'owa-search-store';
import type { Suggestion } from 'owa-search-service/lib/data/schema/SuggestionSet';

/**
 * Returns the suggestion at the index provided (or null if no suggestion
 * exists at that index).
 */
export default function getSuggestionAtIndex(
    index: number,
    scenarioId: SearchScenarioId
): Suggestion {
    const suggestionsSet = getScenarioStore(scenarioId).currentSuggestions;

    // Return null if there are no suggestions.
    if (!suggestionsSet || !suggestionsSet.IsComplete) {
        return null;
    }

    // If there is no suggestion at the given index, return null.
    const suggestion = suggestionsSet.Suggestions[index];
    if (!suggestion) {
        return null;
    }

    return suggestion;
}
