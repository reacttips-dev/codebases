import { onSearchScopeButtonClicked, onSearchScopeUiDismissed } from 'owa-search-actions';

import { mutator } from 'satcheljs';
import { getScenarioStore } from 'owa-search-store';

mutator(onSearchScopeButtonClicked, actionMessage => {
    const store = getScenarioStore(actionMessage.searchScenarioType);
    store.isScopePickerVisible = actionMessage.isScopeVisible;
});

mutator(onSearchScopeUiDismissed, actionMessage => {
    const store = getScenarioStore(actionMessage.searchScenarioType);
    store.isScopePickerVisible = false;
});
