import { getScenarioStore } from 'owa-search-store';
import { mutator } from 'satcheljs';
import { setLatestTraceId } from 'owa-search-actions';

export default mutator(setLatestTraceId, actionMessage => {
    const store = getScenarioStore(actionMessage.scenarioId);
    const traceId = actionMessage.latestTraceId;

    // Update latestTraceId (it holds latest trace ID, regardless of QF or query).
    store.latestTraceId = traceId;

    // Update latestQFTraceId if trace ID is a QF trace ID.
    if (actionMessage.isQFTraceId) {
        store.latestQFTraceId = traceId;
    }
});
