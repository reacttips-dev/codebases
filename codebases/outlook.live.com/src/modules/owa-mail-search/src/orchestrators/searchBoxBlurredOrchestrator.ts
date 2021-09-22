import isMailSearchAction from '../utils/isMailSearchAction';
import { getIsSearchTableShown } from 'owa-mail-list-store';
import { orchestrator } from 'satcheljs';
import { lazyIsSearchBoxEmpty } from 'owa-search';
import { searchBoxBlurred, lazyEndSearchSession } from 'owa-search-actions';
import { SearchScenarioId, getScenarioStore } from 'owa-search-store';

export default orchestrator(searchBoxBlurred, async actionMessage => {
    if (!isMailSearchAction(actionMessage.scenarioId)) {
        return;
    }

    const isSearchBoxEmpty = await lazyIsSearchBoxEmpty.import();

    /**
     * End search session if:
     * - User is in a search session AND
     * - Search box is empty AND
     * - Results aren't being shown
     */
    if (
        getScenarioStore(SearchScenarioId.Mail).searchSessionGuid &&
        isSearchBoxEmpty(SearchScenarioId.Mail) &&
        !getIsSearchTableShown()
    ) {
        const endSearchSession = await lazyEndSearchSession.import();
        endSearchSession(SearchScenarioId.Mail);
    }
});
