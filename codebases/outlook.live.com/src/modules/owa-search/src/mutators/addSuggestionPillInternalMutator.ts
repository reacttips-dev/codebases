import { getScenarioStore } from 'owa-search-store';
import { addSuggestionPillInternal } from 'owa-search-actions';
import { mutator } from 'satcheljs';
import type { PillSuggestion } from 'owa-search-service/lib/data/schema/SuggestionSet';
import { logUsage } from 'owa-analytics';

export default mutator(addSuggestionPillInternal, actionMessage => {
    const searchStore = getScenarioStore(actionMessage.scenarioId);

    const suggestionPill: PillSuggestion = actionMessage.suggestionPill;
    const pillId = suggestionPill.ReferenceId;

    /**
     * Add the suggestion pill to the collection, as well as adding its ID to
     * the array of IDs to maintain order.
     */
    searchStore.suggestionPills.set(pillId, suggestionPill);
    searchStore.suggestionPillIds.push(pillId);

    // 3 is the greatest number of pills which can comfortably fit on all screen widths with current styling
    // Log to determine if this is sufficient
    const numberOfPeoplePills = searchStore.suggestionPillIds.length;
    if (numberOfPeoplePills >= 3) {
        logUsage('Search_ManyPeoplePills', {
            NumberOfPeoplePills: numberOfPeoplePills,
            ScreenWidth: window.screen.width,
            SearchSessionGuid: searchStore.searchSessionGuid,
        });
    }
});
