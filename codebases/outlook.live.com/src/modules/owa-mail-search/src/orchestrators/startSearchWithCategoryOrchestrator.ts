import { startSearchWithCategory } from '../actions/publicActions';
import { getCategoryIdFromName, getMasterCategoryList } from 'owa-categories';
import { addSuggestionPill, lazyClearSearchBox, startSearch } from 'owa-search-actions';
import { SearchScenarioId } from 'owa-search-store';
import { CategorySearchSuggestion, SuggestionKind } from 'owa-search-service';
import { orchestrator } from 'satcheljs';
import { getGuid } from 'owa-guid';

export default orchestrator(startSearchWithCategory, async actionMessage => {
    const { actionSource, categoryName } = actionMessage;

    // First, clear other pills and search text from the search box.
    const clearSearchBox = await lazyClearSearchBox.import();
    clearSearchBox(SearchScenarioId.Mail);

    /**
     * Add category pill
     * getCategoryIdFromName is null when category is not present in store, e.g. user removed a category and then clicked on a category well
     * In that case, we need an identifier for the ReferenceId as it is used as key in suggestion component */
    const categoryPill: CategorySearchSuggestion = {
        kind: SuggestionKind.Category,
        Name: categoryName,
        ReferenceId: getCategoryIdFromName(categoryName, getMasterCategoryList()) || getGuid(),
    };

    // Add category pill to search box.
    addSuggestionPill(categoryPill, true /* suggestionSelected */, SearchScenarioId.Mail);

    // Execute search.
    startSearch(actionSource, SearchScenarioId.Mail);
});
