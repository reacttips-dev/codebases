import { selectPreviousNode } from 'owa-mail-actions/lib/selectPreviousNode';
import isMailSearchAction from '../utils/isMailSearchAction';
import { lazyResetFocus } from 'owa-mail-focus-manager';
import { isImmersiveReadingPaneShown } from 'owa-mail-layout';
import { getIsSearchTableShown } from 'owa-mail-list-store';
import closeImmersiveReadingPane from 'owa-mail-actions/lib/closeImmersiveReadingPane';
import type { ActionSource } from 'owa-mail-store';
import { getStore } from '../store/store';
import {
    clearSearchBox,
    exitSearch,
    lazyEndSearchSession,
    lazySetIsSuggestionsDropdownVisible,
} from 'owa-search-actions';
import { orchestrator } from 'satcheljs';

export default orchestrator(exitSearch, async actionMessage => {
    const { scenarioId, actionSource, forceExit } = actionMessage;

    if (!isMailSearchAction(scenarioId)) {
        return;
    }

    // Don't exit search if refiners or advanced search is visible
    // This can happen when the Escape key is pressed and focus is on
    // one of the advanced search components that is not considered an 'input' control
    const searchStore = getStore();
    if (searchStore.shouldShowAdvancedSearch) {
        return;
    }

    // Ensure suggestions UI is closed.
    const setIsSuggestionsDropdownVisible = await lazySetIsSuggestionsDropdownVisible.import();
    setIsSuggestionsDropdownVisible(false, scenarioId);

    if (!getIsSearchTableShown()) {
        // If the search table isnt being shown we want to return focus to the last item
        // selectPreviousNode will close the reading pane if the last node is a Folder, so
        // to avoid that just manually clear the search box and reset focus
        // This can happen when someone clicks into the search box and presses the back arrow
        // without executing a search./
        clearSearchBox(scenarioId);
        lazyResetFocus.importAndExecute();

        const endSearchSession = await lazyEndSearchSession.import();
        endSearchSession(scenarioId, actionSource);
    } else {
        if (isImmersiveReadingPaneShown() && !forceExit) {
            // just close the reading pane but stay in a search session
            closeImmersiveReadingPane('SearchBoxBackArrow');
        } else {
            // this essentially closes the reading pane, clears the search box, and sets
            // focus on a folder item
            selectPreviousNode(actionSource as ActionSource);
        }
    }
});
