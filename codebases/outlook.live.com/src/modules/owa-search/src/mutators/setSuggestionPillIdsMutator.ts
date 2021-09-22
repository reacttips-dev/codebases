import { getScenarioStore } from 'owa-search-store';
import { mutator } from 'satcheljs';
import { setSuggestionPillIds } from 'owa-search-actions';

export default mutator(setSuggestionPillIds, actionMessage => {
    getScenarioStore(actionMessage.scenarioId).suggestionPillIds = actionMessage.suggestionPillIds;
});
