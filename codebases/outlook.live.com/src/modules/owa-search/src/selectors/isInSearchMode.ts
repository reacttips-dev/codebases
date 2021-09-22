import { SearchScenarioId, getScenarioStore } from 'owa-search-store';

/**
 * User is in search mode (thus in a search session) when searchSessionGuid
 * is non-null.
 */
export default function isInSearchMode(scenarioId: SearchScenarioId): boolean {
    return !!getScenarioStore(scenarioId).searchSessionGuid;
}
