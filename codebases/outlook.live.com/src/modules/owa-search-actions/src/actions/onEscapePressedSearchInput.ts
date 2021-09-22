import { action } from 'satcheljs';
import type { SearchScenarioId } from 'owa-search-store';

export const onEscapePressedSearchInput = action(
    'ON_ESCAPE_PRESSED_SEARCH_INPUT',
    (scenarioId: SearchScenarioId) => ({ scenarioId })
);
