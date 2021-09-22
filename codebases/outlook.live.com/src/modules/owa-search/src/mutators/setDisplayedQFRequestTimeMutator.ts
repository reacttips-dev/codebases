import { getScenarioStore } from 'owa-search-store';
import { mutator } from 'satcheljs';
import { setDisplayedQFRequestTime } from 'owa-search-actions';

export default mutator(setDisplayedQFRequestTime, actionMessage => {
    getScenarioStore(actionMessage.scenarioId).displayedQFRequestTime =
        actionMessage.displayedQFRequestTime;
});
