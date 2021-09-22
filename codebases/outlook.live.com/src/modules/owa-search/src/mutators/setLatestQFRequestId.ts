import { mutatorAction } from 'satcheljs';
import { SearchScenarioId, getScenarioStore } from 'owa-search-store';

export default mutatorAction(
    'setLatestQFRequestId',
    (latestQFRequestId: string, scenarioId: SearchScenarioId): void => {
        getScenarioStore(scenarioId).latestQFRequestId = latestQFRequestId;
    }
);
