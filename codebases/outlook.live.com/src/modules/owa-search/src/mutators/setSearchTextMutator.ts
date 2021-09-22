import { getScenarioStore } from 'owa-search-store';
import { mutator } from 'satcheljs';
import { setSearchText } from 'owa-search-actions';

export default mutator(setSearchText, actionMessage => {
    getScenarioStore(actionMessage.scenarioId).searchText = actionMessage.searchText;
});
