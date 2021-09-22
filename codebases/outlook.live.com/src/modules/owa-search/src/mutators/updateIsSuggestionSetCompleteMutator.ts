import { getScenarioStore } from 'owa-search-store';
import { mutator } from 'satcheljs';
import { updateIsSuggestionSetCompleteInternal } from 'owa-search-actions';

export default mutator(updateIsSuggestionSetCompleteInternal, actionMessage => {
    const currentSuggestions = getScenarioStore(actionMessage.scenarioId).currentSuggestions;
    currentSuggestions.IsComplete = actionMessage.isComplete;
});
