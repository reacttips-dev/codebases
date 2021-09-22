import { mutatorAction } from 'satcheljs';
import { SearchScenarioId, getScenarioStore } from 'owa-search-store';

export default mutatorAction(
    'setSearchSessionGuid',
    (searchSessionGuid: string, scenarioId: SearchScenarioId): void => {
        getScenarioStore(scenarioId).searchSessionGuid = searchSessionGuid;
    }
);
