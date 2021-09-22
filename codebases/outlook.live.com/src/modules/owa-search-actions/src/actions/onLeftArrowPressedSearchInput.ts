import { action } from 'satcheljs';
import type { SearchScenarioId } from 'owa-search-store';

export const onLeftArrowPressedSearchInput = action(
    'ON_LEFT_ARROW_PRESSED_SEARCH_INPUT',
    (cursorPosition: number, scenarioId: SearchScenarioId) => ({ cursorPosition, scenarioId })
);
