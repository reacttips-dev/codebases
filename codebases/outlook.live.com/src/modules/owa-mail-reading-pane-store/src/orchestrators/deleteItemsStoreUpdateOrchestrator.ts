import deleteItemsStoreUpdate, {
    ItemContext,
} from 'owa-mail-actions/lib/triage/deleteItemsStoreUpdate';
import cleanUpItemClientSide from '../actions/cleanUpItemClientSide';
import { createLazyOrchestrator } from 'owa-bundling';

export const deleteItemsStoreUpdateOrchestrator = createLazyOrchestrator(
    deleteItemsStoreUpdate,
    'DELETE_ITEMS_STORE_UPDATE_CLONE',
    actionMessage => {
        const itemContexts: ItemContext[] = actionMessage.itemContexts;
        for (const itemContext of itemContexts) {
            cleanUpItemClientSide({ Id: itemContext.itemId }, itemContext.itemConversationId);
        }
    }
);
