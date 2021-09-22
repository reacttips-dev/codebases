import { action } from 'satcheljs';
import type { SearchScenarioId } from 'owa-search-store';

export const onRightArrowPressedSearchInput = action(
    'ON_Right_ARROW_PRESSED_SEARCH_INPUT',
    (scenarioId: SearchScenarioId) => ({ scenarioId })
);
