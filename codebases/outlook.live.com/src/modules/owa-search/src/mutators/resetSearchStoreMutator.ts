import { createDefaultSearchStore, getScenarioStore } from 'owa-search-store';
import { ObservableMap } from 'mobx';
import { mutator } from 'satcheljs';
import type { PillSuggestion } from 'owa-search-service/lib/data/schema/SuggestionSet';
import { resetSearchStore } from 'owa-search-actions';

export default mutator(resetSearchStore, actionMessage => {
    const store = getScenarioStore(actionMessage.scenarioId);
    const defaultSearchStore = createDefaultSearchStore();

    // Reset store to defaults.
    store.currentSearchQueryId = defaultSearchStore.currentSearchQueryId;
    store.currentSuggestions = defaultSearchStore.currentSuggestions;
    store.isSuggestionsDropdownVisible = defaultSearchStore.isSuggestionsDropdownVisible;
    store.latestQFRequestId = defaultSearchStore.latestQFRequestId;
    store.latestTraceId = defaultSearchStore.latestTraceId;
    store.nextSearchQueryId = defaultSearchStore.nextSearchQueryId;
    store.searchSessionGuid = defaultSearchStore.searchSessionGuid;
    store.searchText = defaultSearchStore.searchText;
    store.searchTextForSuggestion = defaultSearchStore.searchTextForSuggestion;
    store.selectedSuggestionIndex = defaultSearchStore.selectedSuggestionIndex;
    store.suggestedSearchTerm = defaultSearchStore.suggestedSearchTerm;
    store.suggestionPillIds = defaultSearchStore.suggestionPillIds;
    store.suggestionPills = new ObservableMap<string, PillSuggestion>();
});
