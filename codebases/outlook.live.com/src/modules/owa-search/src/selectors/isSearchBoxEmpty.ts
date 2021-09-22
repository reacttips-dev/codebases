import { SearchScenarioId, getScenarioStore } from 'owa-search-store';

export default function isSearchBoxEmpty(scenarioId: SearchScenarioId) {
    const store = getScenarioStore(scenarioId);

    return store.searchText.trim().length === 0 && store.suggestionPillIds.length === 0;
}
