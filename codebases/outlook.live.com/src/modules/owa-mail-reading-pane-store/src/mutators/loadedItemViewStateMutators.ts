import type ItemReadingPaneViewState from '../store/schema/ItemReadingPaneViewState';
import { getStore } from '../store/Store';
import { mutatorAction } from 'satcheljs';
import { secondaryTabsHaveId } from 'owa-tab-store';
import getPrimaryTabId from '../utils/getPrimaryTabId';

export const addLoadedItemReadingPaneViewState = mutatorAction(
    'addLoadedItemReadingPaneViewState',
    function (itemReadingPaneViewState: ItemReadingPaneViewState) {
        const itemId = itemReadingPaneViewState.itemId;
        const { loadedItemReadingPaneViewStates } = getStore();
        if (!loadedItemReadingPaneViewStates.has(itemId)) {
            loadedItemReadingPaneViewStates.set(itemId, itemReadingPaneViewState);
        }
    }
);

export const releaseOrphanedLoadedItemViewStates = mutatorAction(
    'releaseOrphanedLoadedItemViewStates',
    function () {
        const { loadedItemReadingPaneViewStates } = getStore();
        // Release any view states that do not belong to any tabs
        loadedItemReadingPaneViewStates.forEach((viewState, loadedItemId) => {
            if (!secondaryTabsHaveId(loadedItemId) && loadedItemId != getPrimaryTabId()) {
                loadedItemReadingPaneViewStates.delete(loadedItemId);
            }
        });
    }
);

export const releaseLoadedItemViewState = mutatorAction(
    'releaseLoadedItemViewState',
    function (itemId: string) {
        getStore().loadedItemReadingPaneViewStates.delete(itemId);
    }
);
