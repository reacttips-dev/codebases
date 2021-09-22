import { action } from 'satcheljs';
import type { SearchScenarioId } from 'owa-search-store';

export const setSelectedPillIndex = action(
    'SET_SELECTED_PILL_INDEX',
    (selectedPillIndex: number, scenarioId: SearchScenarioId) => ({
        selectedPillIndex,
        scenarioId,
    })
);
