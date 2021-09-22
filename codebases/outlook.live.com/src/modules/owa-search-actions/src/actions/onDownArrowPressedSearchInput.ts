import { action } from 'satcheljs';
import type { SearchScenarioId } from 'owa-search-store';

export const onDownArrowPressedSearchInput = action(
    'ON_DOWN_ARROW_PRESSED_SEARCH_INPUT',
    (scenarioId: SearchScenarioId) => ({
        scenarioId,
    })
);
