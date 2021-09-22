import { clearSearchBox } from 'owa-search-actions';
import { createDefaultSearchStore, getScenarioStore } from 'owa-search-store';
import { ObservableMap } from 'mobx';
import { mutator } from 'satcheljs';
import type { PillSuggestion } from 'owa-search-service/lib/data/schema/SuggestionSet';

export default mutator(clearSearchBox, actionMessage => {
    const store = getScenarioStore(actionMessage.scenarioId);
    const defaultSearchStore = createDefaultSearchStore();

    // Clear suggestion pills.
    store.suggestionPillIds = defaultSearchStore.suggestionPillIds;
    store.suggestionPills = new ObservableMap<string, PillSuggestion>();

    // Clear plain text search query.
    store.searchText = defaultSearchStore.searchText;
});
