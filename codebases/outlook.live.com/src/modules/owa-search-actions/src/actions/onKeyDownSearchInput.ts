import { action } from 'satcheljs';
import type { SearchScenarioId } from 'owa-search-store';

export const onKeyDownSearchInput = action(
    'ON_KEY_DOWN_SEARCH_INPUT',
    (evtKeyCode: number, scenarioId: SearchScenarioId) => ({
        evtKeyCode,
        scenarioId,
    })
);
