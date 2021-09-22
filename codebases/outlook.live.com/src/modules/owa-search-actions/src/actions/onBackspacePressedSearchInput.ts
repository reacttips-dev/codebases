import { action } from 'satcheljs';
import type { SearchScenarioId } from 'owa-search-store';

export const onBackspacePressedSearchInput = action(
    'ON_BACKSPACE_PRESSED_SEARCH_INPUT',
    (cursorPosition: number, scenarioId: SearchScenarioId) => ({ cursorPosition, scenarioId })
);
