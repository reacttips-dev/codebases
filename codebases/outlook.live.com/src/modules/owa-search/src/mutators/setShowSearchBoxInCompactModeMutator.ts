import { getScenarioStore } from 'owa-search-store';
import { mutator } from 'satcheljs';
import { setShowSearchBoxInCompactMode } from 'owa-search-actions';

/**
 * Sets showSearchBoxInCompactMode value in store to passed in value
 */
export default mutator(setShowSearchBoxInCompactMode, actionMessage => {
    getScenarioStore(actionMessage.scenarioId).showSearchBoxInCompactMode =
        actionMessage.showSearchBoxInCompactMode;
});
