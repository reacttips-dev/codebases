import { SearchScenarioId, getScenarioStore } from 'owa-search-store';

export default function hasSuggestionPills(scenarioId: SearchScenarioId): boolean {
    const store = getScenarioStore(scenarioId);
    return !!store.suggestionPills.size;
}
