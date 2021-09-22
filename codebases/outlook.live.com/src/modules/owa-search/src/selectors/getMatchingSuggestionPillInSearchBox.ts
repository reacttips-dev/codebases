import { SearchScenarioId, getScenarioStore } from 'owa-search-store';
import { PillSuggestion, SuggestionKind } from 'owa-search-service/lib/data/schema/SuggestionSet';

/**
 * Helper function to determine if given suggestion pill already exists in the
 * search box.
 * @param suggestionPill Suggestion pill to compare against suggestions in store
 */
export default function getMatchingSuggestionPillInSearchBox(
    suggestionPill: PillSuggestion,
    scenarioId: SearchScenarioId
): string | null {
    const store = getScenarioStore(scenarioId);

    switch (suggestionPill.kind) {
        /**
         * For persona pills, verify there is no overlap of email addresses between
         * the pill that is trying to be added with any email addresses of suggestions
         * that are already in the store.
         * If there is a duplicate, return its ID.
         */
        case SuggestionKind.People: {
            const matchingPills = [...store.suggestionPills.values()].filter(
                (suggestionPillInStore: PillSuggestion) => {
                    if (suggestionPillInStore.kind !== SuggestionKind.People) {
                        return false;
                    }

                    for (const selectedSuggestionEmail of suggestionPill.EmailAddresses) {
                        for (const storeSuggestionEmail of suggestionPillInStore.EmailAddresses) {
                            if (selectedSuggestionEmail === storeSuggestionEmail) {
                                return true;
                            }
                        }
                    }

                    return false;
                }
            );

            if (matchingPills.length == 1) {
                return matchingPills[0].ReferenceId;
            }
            return null;
        }
        /**
         * For category pills, verify that there is no other suggestion with the
         * same ReferenceId already in the store.
         */
        case SuggestionKind.Category: {
            return store.suggestionPillIds.indexOf(suggestionPill.ReferenceId) > -1
                ? suggestionPill.ReferenceId
                : null;
        }
        default:
            return null;
    }
}
