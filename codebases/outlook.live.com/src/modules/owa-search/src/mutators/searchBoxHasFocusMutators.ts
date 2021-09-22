import { mutator } from 'satcheljs';
import { onSearchInputFocused, searchBoxBlurred } from 'owa-search-actions';
import { getScenarioStore } from 'owa-search-store';

mutator(onSearchInputFocused, actionMessage => {
    getScenarioStore(actionMessage.scenarioId).searchBoxHasFocus = true;
});

mutator(searchBoxBlurred, actionMessage => {
    getScenarioStore(actionMessage.scenarioId).searchBoxHasFocus = false;
});
