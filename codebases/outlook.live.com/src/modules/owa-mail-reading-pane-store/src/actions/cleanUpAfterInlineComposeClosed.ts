import loadConversationReadingPane from './loadConversationReadingPane';
import type ConversationReadingPaneViewState from '../store/schema/ConversationReadingPaneViewState';
import getConversationReadingPaneViewState from '../utils/getConversationReadingPaneViewState';
import type { ObservableMap } from 'mobx';
import { ConversationItem, listViewStore, MailRowDataPropertyGetter } from 'owa-mail-list-store';
import getSelectedTableView from 'owa-mail-list-store/lib/utils/getSelectedTableView';
import { deleteConversationItemParts } from 'owa-mail-store-actions';
import type ConversationItemParts from 'owa-mail-store/lib/store/schema/ConversationItemParts';
import mailstore from 'owa-mail-store/lib/store/Store';
import { getActiveContentTab, TabType } from 'owa-tab-store';
import { action } from 'satcheljs/lib/legacy';

export interface CleanUpAfterInlineComposeClosedState {
    conversationReadingPaneViewState: ConversationReadingPaneViewState;
    conversations: ObservableMap<string, ConversationItemParts>;
    conversationItems: ObservableMap<string, ConversationItem>;
}

export default action('cleanUpAfterInlineComposeClosed')(function cleanUpAfterInlineComposeClosed(
    conversationId: string,
    state: CleanUpAfterInlineComposeClosedState = {
        conversationReadingPaneViewState: getConversationReadingPaneViewState(),
        conversations: mailstore.conversations,
        conversationItems: listViewStore.conversationItems,
    }
) {
    const readingPaneState = state.conversationReadingPaneViewState;
    if (readingPaneState && readingPaneState.conversationId.Id == conversationId) {
        // If delete conversation item parts or load selected item get delayed due to inline compose open, take action now.
        const conversationId = readingPaneState.conversationId.Id;
        const conversationItemParts = state.conversations.get(conversationId);
        if (conversationItemParts?.isPendingDelete) {
            deleteConversationItemParts(conversationId);
        }
        // tableView is null in Photohub
        const tableView = getSelectedTableView();
        const selectedRowKeys = tableView ? [...tableView.selectedRowKeys.keys()] : [];
        if (selectedRowKeys.length == 1) {
            const instrumentationContext =
                state.conversationReadingPaneViewState.instrumentationContext;
            const rowId = MailRowDataPropertyGetter.getRowClientItemId(
                selectedRowKeys[0],
                tableView
            );
            const activeTab = getActiveContentTab();
            if (rowId.Id != conversationId && activeTab && activeTab.type == TabType.Primary) {
                const rowSubject = MailRowDataPropertyGetter.getSubject(
                    selectedRowKeys[0],
                    tableView
                );
                loadConversationReadingPane(rowId, instrumentationContext, rowSubject);
            }
        }
    }
});
