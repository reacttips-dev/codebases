import { mutatorAction } from 'satcheljs';
import { SearchScenarioId, getScenarioStore } from 'owa-search-store';

export default mutatorAction(
    'setLatestRenderedQFTraceId',
    (latestRenderedQFTraceId: string, scenarioId: SearchScenarioId): void => {
        getScenarioStore(scenarioId).latestRenderedQFTraceId = latestRenderedQFTraceId;
    }
);
