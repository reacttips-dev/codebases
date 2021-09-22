import { action } from 'satcheljs';
import type { SearchScenarioId } from 'owa-search-store';

export const onUpArrowPressedSearchInput = action(
    'ON_UP_ARROW_PRESSED_SEARCH_INPUT',
    (scenarioId: SearchScenarioId) => ({ scenarioId })
);
