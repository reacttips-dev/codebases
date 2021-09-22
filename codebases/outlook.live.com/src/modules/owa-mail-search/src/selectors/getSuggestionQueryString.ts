import { SearchScenarioId, getScenarioStore } from 'owa-search-store';

export default function getSuggestionQueryString(scenarioId: SearchScenarioId): string {
    return getScenarioStore(scenarioId).searchTextForSuggestion;
}
