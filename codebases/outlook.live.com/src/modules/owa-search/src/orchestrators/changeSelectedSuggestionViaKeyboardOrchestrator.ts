import { getScenarioStore } from 'owa-search-store';
import { Suggestion, SuggestionKind } from 'owa-search-service/lib/data/schema/SuggestionSet';
import { lazyLogSearchBoxStateChanged } from 'owa-search-instrumentation';
import { orchestrator } from 'satcheljs';
import {
    addSuggestionPill,
    changeSelectedSuggestionViaKeyboard,
    clearSearchBox,
    setSearchText,
    setSelectedSuggestionIndex,
} from 'owa-search-actions';
import getSubstrateSearchScenarioBySearchScenarioId from '../utils/getSubstrateSearchScenarioBySearchScenarioId';

export default orchestrator(changeSelectedSuggestionViaKeyboard, actionMessage => {
    const indexToSelect = actionMessage.indexToSelect;
    const suggestionToSelect: Suggestion = actionMessage.suggestionToSelect;
    const scenarioId = actionMessage.scenarioId;
    const store = getScenarioStore(scenarioId);

    // Dispatch action to clear search box.
    clearSearchBox(scenarioId);

    // Add suggestion to SearchInput (based on kind).
    switch (suggestionToSelect.kind) {
        case SuggestionKind.Category:
        case SuggestionKind.People:
            addSuggestionPill(suggestionToSelect, false /* suggestionSelected */, scenarioId);
            break;
        case SuggestionKind.Keywords:
        case SuggestionKind.TrySuggestion:
            setSearchText(suggestionToSelect.QueryText, scenarioId);
            break;
        case SuggestionKind.Message:
        case SuggestionKind.File:
        case SuggestionKind.Event:
            setSearchText(store.searchTextForSuggestion, scenarioId);
            break;
    }

    // Update the selected index in the store.
    setSelectedSuggestionIndex(indexToSelect, scenarioId);

    /**
     * Log that search box state changed because of keyboard navigation
     * (if using 3S and is a 3S suggestion, i.e. QF request ID exists and there
     * is non-empty searchTextForSuggestion).
     */
    if (store.isUsing3S && store.latestTraceId && store.searchTextForSuggestion) {
        lazyLogSearchBoxStateChanged.importAndExecute(
            new Date() /* currentTime */,
            'navigation' /* reason */,
            suggestionToSelect.ReferenceId,
            store.latestTraceId,
            getSubstrateSearchScenarioBySearchScenarioId(scenarioId)
        );
    }
});
