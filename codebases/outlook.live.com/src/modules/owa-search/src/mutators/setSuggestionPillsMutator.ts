import { getScenarioStore } from 'owa-search-store';
import { mutator } from 'satcheljs';
import { setSuggestionPills } from 'owa-search-actions';

export default mutator(setSuggestionPills, actionMessage => {
    getScenarioStore(actionMessage.scenarioId).suggestionPills = actionMessage.suggestionPills;
});
