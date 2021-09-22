import type { SearchScenarioId } from 'owa-search-store';
import { action } from 'satcheljs';

export const setShowSearchBoxInCompactMode = action(
    'setShowSearchBoxInCompactMode',
    function setShowSearchBoxInCompactMode(
        scenarioId: SearchScenarioId,
        showSearchBoxInCompactMode: boolean
    ) {
        return {
            scenarioId,
            showSearchBoxInCompactMode,
        };
    }
);
