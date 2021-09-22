import { SEARCHBOX_ID } from 'owa-search-constants';
import { SearchScenarioId, getScenarioIdKey } from 'owa-search-store';

/**
 * Converts given scenarioId to a string (to be used as the id for the search box).
 * @param scenarioId ID representing search scenario
 */
export default function getSearchBoxIdByScenarioId(scenarioId: SearchScenarioId): string {
    return `${SEARCHBOX_ID}-${getScenarioIdKey(scenarioId)}`;
}
