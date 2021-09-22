import { getScenarioStore } from 'owa-search-store';
import type SuggestionSet from 'owa-search-service/lib/data/schema/SuggestionSet';
import { mutator } from 'satcheljs';
import { setCurrentSuggestions } from 'owa-search-actions';

mutator(setCurrentSuggestions, actionMessage => {
    const suggestionSet: SuggestionSet = actionMessage.suggestionSet;

    // Update suggestions in the store.
    getScenarioStore(actionMessage.scenarioId).currentSuggestions = suggestionSet;
});
