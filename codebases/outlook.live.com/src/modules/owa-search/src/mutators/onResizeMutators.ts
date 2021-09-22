import { mutator } from 'satcheljs';
import { onResize } from 'owa-search-actions';
import { getScenarioStore } from 'owa-search-store';

mutator(onResize, actionMessage => {
    const { scenarioId, searchBoxWidth } = actionMessage;
    getScenarioStore(scenarioId).searchBoxWidth = searchBoxWidth;
});
