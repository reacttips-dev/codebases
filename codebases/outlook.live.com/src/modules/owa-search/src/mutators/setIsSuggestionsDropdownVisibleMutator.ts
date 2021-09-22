import { getScenarioStore } from 'owa-search-store';
import { mutator } from 'satcheljs';
import { setIsSuggestionsDropdownVisible } from 'owa-search-actions';

mutator(setIsSuggestionsDropdownVisible, actionMessage => {
    getScenarioStore(actionMessage.scenarioId).isSuggestionsDropdownVisible =
        actionMessage.isSuggestionsDropdownVisible;
});
