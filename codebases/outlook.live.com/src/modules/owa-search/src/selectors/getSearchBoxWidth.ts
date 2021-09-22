import { SearchScenarioId, getScenarioStore } from 'owa-search-store';

export default function getSearchBoxWidth(scenarioId: SearchScenarioId): number {
    return getScenarioStore(scenarioId).searchBoxWidth;
}
