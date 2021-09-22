import { SearchScenarioId, getScenarioStore } from 'owa-search-store';

export default function isQFRequestIdEqualToLatest(
    qfRequestId: string,
    scenarioId: SearchScenarioId
): boolean {
    return qfRequestId === getScenarioStore(scenarioId).latestQFRequestId;
}
