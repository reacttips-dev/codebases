import { updateCachedSuggestionSet } from '../actions/internalActions';
import { getStore } from '../store/store';
import { Suggestion, SuggestionKind } from 'owa-search-service';
import { mutator } from 'satcheljs';

/**
 * The name of this action/mutator is a misnomer, but copied over as part of
 * refactor. It doesn't really update suggestions - it just adds to existing
 * cached suggestions. It takes an array of new suggestions, de-dupes compared
 * to what already exists for given search text, and then adds those on top.
 */
export default mutator(updateCachedSuggestionSet, actionMessage => {
    const cachedSuggestionSets = getStore().legacySuggestions;
    const searchText = actionMessage.searchText;
    const freshSuggestions: Suggestion[] = actionMessage.suggestions;

    /**
     * If the collection of cached suggestion sets in the store doesn't have an
     * entry for the given searchText, create a new suggestion set and set it
     * in the collection.
     */
    if (!cachedSuggestionSets.has(searchText)) {
        const suggestionSet = { Suggestions: freshSuggestions, IsComplete: false };
        cachedSuggestionSets.set(searchText, suggestionSet);
    } else {
        const cachedSuggestionSet = cachedSuggestionSets.get(searchText);

        // De-dupe fresh suggestions against cached suggestions.
        const suggestionsToAdd = freshSuggestions.filter(freshSuggestion => {
            switch (freshSuggestion.kind) {
                /**
                 * Only add a keyword suggestion if there aren't any cached keyword
                 * suggestions that have the same "DisplayText" value.
                 */
                case SuggestionKind.Keywords: {
                    return (
                        cachedSuggestionSet.Suggestions.filter(
                            cachedSuggestion =>
                                cachedSuggestion.kind === SuggestionKind.Keywords &&
                                cachedSuggestion.DisplayText === freshSuggestion.DisplayText
                        ).length === 0
                    );
                }

                /**
                 * Only add a people suggestion if there aren't any cached people
                 * suggestions that share any email addresses with it.
                 */
                case SuggestionKind.People: {
                    return (
                        cachedSuggestionSet.Suggestions.filter(
                            cachedSuggestion =>
                                cachedSuggestion.kind === SuggestionKind.People &&
                                cachedSuggestion.EmailAddresses.filter(
                                    emailAddress =>
                                        freshSuggestion.EmailAddresses.indexOf(emailAddress) > -1
                                ).length > 0
                        ).length === 0
                    );
                }

                // Don't add any non-keyword or non-people suggestions.
                default:
                    return false;
            }
        });

        // Merge cached suggestions with de-duped fresh suggestions.
        const unsortedMergedSuggestions = cachedSuggestionSet.Suggestions.concat(
            ...suggestionsToAdd
        );

        // Filter out keyword suggestions.
        const keywordSuggestions = unsortedMergedSuggestions.filter(
            suggestion => suggestion.kind === SuggestionKind.Keywords
        );

        // Filter out people suggestions.
        const peopleSuggestions = unsortedMergedSuggestions.filter(
            suggestion => suggestion.kind === SuggestionKind.People
        );

        // Merge keyword and people suggestions (in order).
        const sortedMergedSuggestions = keywordSuggestions.concat(...peopleSuggestions);

        // Update suggestions in cached suggestion set.
        cachedSuggestionSet.Suggestions = sortedMergedSuggestions;
    }
});
