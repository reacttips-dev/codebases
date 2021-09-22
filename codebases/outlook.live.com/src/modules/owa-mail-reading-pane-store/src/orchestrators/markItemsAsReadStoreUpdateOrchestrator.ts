import markItemReadInReadingPaneStore from '../actions/markItemReadInReadingPaneStore';
import markItemsAsReadStoreUpdate from 'owa-mail-actions/lib/triage/markItemsAsReadStoreUpdate';
import { createLazyOrchestrator } from 'owa-bundling';

export const markItemsAsReadStoreUpdateOrchestrator = createLazyOrchestrator(
    markItemsAsReadStoreUpdate,
    'MARK_ITEMS_AS_READ_STORE_UPDATE_CLONE',
    actionMessage => {
        const { itemIds, isReadValue } = actionMessage;
        itemIds.forEach(itemId => markItemReadInReadingPaneStore(itemId, isReadValue));
    }
);
