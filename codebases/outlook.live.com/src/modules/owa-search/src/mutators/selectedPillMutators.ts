import { getScenarioStore } from 'owa-search-store';
import { mutator } from 'satcheljs';
import { setSelectedPillIndex } from 'owa-search-actions';

export default mutator(setSelectedPillIndex, actionMessage => {
    getScenarioStore(actionMessage.scenarioId).selectedPillIndex = actionMessage.selectedPillIndex;
});
