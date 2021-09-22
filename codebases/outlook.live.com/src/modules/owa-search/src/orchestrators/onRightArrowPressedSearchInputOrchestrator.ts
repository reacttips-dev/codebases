import { getScenarioStore } from 'owa-search-store';
import hasSuggestionPills from '../selectors/hasSuggestionPills';
import { onRightArrowPressedSearchInput, setSelectedPillIndex } from 'owa-search-actions';

import { orchestrator } from 'satcheljs';

export default orchestrator(onRightArrowPressedSearchInput, actionMessage => {
    const scenarioId = actionMessage.scenarioId;
    const store = getScenarioStore(scenarioId);

    const selectedPillIndex = store.selectedPillIndex;

    // If there aren't any suggestion pills then bail.
    if (!hasSuggestionPills(scenarioId)) {
        return;
    }

    // Select the pill to the right (index + 1).
    setSelectedPillIndex(selectedPillIndex + 1, scenarioId);
});
