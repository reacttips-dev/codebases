import type ItemReadingPaneViewState from '../store/schema/ItemReadingPaneViewState';
import { getStore } from '../store/Store';
import getActiveTabId from './getActiveTabId';

export default function getItemReadingPaneViewState(itemId?: string): ItemReadingPaneViewState {
    return getStore().loadedItemReadingPaneViewStates.get(itemId || getActiveTabId());
}
