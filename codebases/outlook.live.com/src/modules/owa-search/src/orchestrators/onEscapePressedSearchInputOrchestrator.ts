import { getScenarioStore } from 'owa-search-store';
import {
    exitSearch,
    onEscapePressedSearchInput,
    setIsSuggestionsDropdownVisible,
} from 'owa-search-actions';
import { orchestrator } from 'satcheljs';

orchestrator(onEscapePressedSearchInput, actionMessage => {
    const scenarioId = actionMessage.scenarioId;
    const store = getScenarioStore(scenarioId);

    /**
     * If suggestions dropdown is visible hide it. If it's already hidden, then
     * exit search.
     */
    if (store.isSuggestionsDropdownVisible) {
        setIsSuggestionsDropdownVisible(false, scenarioId);
    } else {
        exitSearch('Escape', scenarioId);
    }
});
