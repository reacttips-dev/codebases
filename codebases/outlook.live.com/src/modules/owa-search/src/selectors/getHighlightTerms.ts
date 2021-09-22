import { SearchScenarioId, getScenarioStore } from 'owa-search-store';
import type SearchResultsType from 'owa-service/lib/contract/SearchResultsType';
import {
    PillSuggestion,
    PeopleSuggestion,
    CategorySearchSuggestion,
    SuggestionKind,
} from 'owa-search-service/lib/data/schema/SuggestionSet';

/**
 * Gets the Hit Highlight terms from search response, removing
 * any redundant terms including:
 *    - People Suggestion name
 *    - People Suggestion email address
 * @param searchResult parsed search response
 */
export default function getHighlightTerms(searchResult: SearchResultsType): string[] {
    const searchStore = getScenarioStore(SearchScenarioId.Mail);
    const { suggestionPills } = searchStore;

    let highlightTerms = searchResult.SearchTerms;

    // If there are any pills, remove the pill text from the highlight terms
    suggestionPills.forEach((pill: PillSuggestion) => {
        switch (pill.kind) {
            // Remove DisplayName and EmailAddress from People pills
            case SuggestionKind.People: {
                const persona = pill as PeopleSuggestion;
                const nameParts = persona.DisplayName.toLowerCase().split(' ');
                removeAll(highlightTerms, nameParts);
                removeAll(highlightTerms, persona.EmailAddresses);
                break;
            }
            // Remove Name from Category pills
            case SuggestionKind.Category: {
                const category = pill as CategorySearchSuggestion;
                const categoryParts = category.Name.toLowerCase().split(' ');
                removeAll(highlightTerms, categoryParts);
            }
        }
    });

    return highlightTerms;
}

function removeAll(items: string[], itemsToRemove: string[]) {
    itemsToRemove.forEach((item: string) => {
        removeItem(items, item);
    });
}

function removeItem(items: string[], item: string) {
    let index = -1;
    for (var i = 0; i < items.length; i++) {
        if (
            items[i].localeCompare(item, 'en', { sensitivity: 'base', ignorePunctuation: true }) ==
            0
        ) {
            index = i;
        }
    }

    if (index > -1) {
        items.splice(index, 1);
    }
}
