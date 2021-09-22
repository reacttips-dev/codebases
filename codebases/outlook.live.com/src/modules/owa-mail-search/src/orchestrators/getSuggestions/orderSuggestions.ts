import { Suggestion, SuggestionKind } from 'owa-search-service';

/**
 * This should match the order in getSuggestionCalloutContent as well.
 */
export default function orderSuggestions(suggestions: Suggestion[]): Suggestion[] {
    const bestMatchSuggestions = suggestions.filter(
        (suggestion: Suggestion) => suggestion.BestMatchPosition !== -1
    );
    const nonBestMatchSuggestions = suggestions.filter(
        (suggestion: Suggestion) => suggestion.BestMatchPosition === -1
    );

    const trySuggestions = nonBestMatchSuggestions.filter((suggestion: Suggestion) => {
        return suggestion.kind === SuggestionKind.TrySuggestion;
    });

    const searchExecutingSuggestions = nonBestMatchSuggestions.filter((suggestion: Suggestion) => {
        return (
            suggestion.kind === SuggestionKind.Keywords ||
            suggestion.kind === SuggestionKind.People ||
            suggestion.kind === SuggestionKind.PrivateDistributionList ||
            suggestion.kind === SuggestionKind.Category
        );
    });

    const potentialMatchesSuggestions = nonBestMatchSuggestions.filter((suggestion: Suggestion) => {
        return (
            suggestion.kind === SuggestionKind.File ||
            suggestion.kind === SuggestionKind.Message ||
            suggestion.kind === SuggestionKind.Event
        );
    });

    return [].concat(
        trySuggestions,
        bestMatchSuggestions,
        searchExecutingSuggestions,
        potentialMatchesSuggestions
    );
}
