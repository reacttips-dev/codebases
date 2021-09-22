import { getScenarioStore } from 'owa-search-store';
import { mutator } from 'satcheljs';
import { setSearchTextForSuggestion } from 'owa-search-actions';

export default mutator(setSearchTextForSuggestion, actionMessage => {
    getScenarioStore(actionMessage.scenarioId).searchTextForSuggestion =
        actionMessage.searchTextForSuggestion;
});
