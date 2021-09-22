import { SearchScenarioId, getScenarioStore } from 'owa-search-store';
import { mutatorAction } from 'satcheljs';

export default mutatorAction(
    'setNextSearchQueryId',
    (nextSearchQueryId: string, scenarioId: SearchScenarioId): void => {
        getScenarioStore(scenarioId).nextSearchQueryId = nextSearchQueryId;
    }
);
