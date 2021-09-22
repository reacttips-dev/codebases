import markConversationsReadInReadingPaneStore from '../actions/markConversationsReadInReadingPaneStore';
import markConversationsAsReadStoreUpdate from 'owa-mail-actions/lib/triage/markConversationsAsReadStoreUpdate';
import { getFolderIdForParentComparison } from 'owa-mail-list-store';
import { createLazyOrchestrator } from 'owa-bundling';

export const markConversationsAsReadStoreUpdateOrchestrator = createLazyOrchestrator(
    markConversationsAsReadStoreUpdate,
    'MARK_CONVERSATIONS_AS_READ_STORE_UPDATE_CLONE',
    actionMessage => {
        const { conversationIds, tableViewId, isReadValue } = actionMessage;

        markConversationsReadInReadingPaneStore(
            conversationIds,
            isReadValue,
            getFolderIdForParentComparison(tableViewId)
        );
    }
);
