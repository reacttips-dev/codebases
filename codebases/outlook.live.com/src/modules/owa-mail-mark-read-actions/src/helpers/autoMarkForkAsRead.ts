import markForksAsRead from './markForksAsRead';
import markItemsAsReadBasedOnItemIds from './markItemsAsReadBasedOnItemIds';
import type { ClientItemId } from 'owa-client-ids';
import { MailRowDataPropertyGetter, TableView, listViewStore } from 'owa-mail-list-store';
import getForksInConversation from 'owa-mail-store-unstacked/lib/utils/getForksInConversation';
import getAncestorsOfMessageIncludingCurrentItem from 'owa-mail-store-unstacked/lib/utils/getAncestorsOfMessageIncludingCurrentItem';
import isHxForksEnabled from 'owa-mail-store-unstacked/lib/utils/isHxForksEnabled';
import getForkBasedOnItemId from 'owa-mail-store-unstacked/lib/utils/getForkBasedOnItemId';
import markItemsAsReadStoreUpdate from 'owa-mail-actions/lib/triage/markItemsAsReadStoreUpdate';
import autoMarkConversationAsRead from './autoMarkConversationAsRead';

// Marks the items in top fork as read, marks the conversation as read if there are no forks
// When called from autoMarkReadTimer, rowKey is undefined and obtained from tableView and itemId is that of the actual item on reading pane.
// When called from onSingleSelectionChanged, rowKey is passed as a parameter because it might not be available in tableView
// for a scenario like folder change. itemId is the conversation id string for the selected row.
export default async function autoMarkForkAsRead(
    tableView: TableView,
    itemId: string,
    rowKey: string,
    isReadValue: boolean
) {
    if (!itemId) {
        return;
    }

    const rowKeyToActOn = rowKey || [...tableView.selectedRowKeys.keys()][0];
    const conversationId: ClientItemId = MailRowDataPropertyGetter.getRowClientItemId(
        rowKeyToActOn,
        tableView
    );
    const conversationIdString = conversationId?.Id;
    if (!conversationIdString) {
        // This happens when switching from drafts to other folder since drafts folder is treated as MessageView.
        // Mark as read behavior for unstacked reading pane no longer applies in this case and is handled like normal message view.
        return;
    }

    if (isHxForksEnabled()) {
        // To handle search folder as well, we need to get the parentFolderId from the mailRowDataPropertyGetter
        const parentFolderId: string = MailRowDataPropertyGetter.getParentFolderId(
            rowKeyToActOn,
            tableView
        );

        let forks = [];
        if (parentFolderId) {
            const expandedConversationViewState = listViewStore.expandedConversationViewState;
            forks =
                expandedConversationViewState?.expandedRowKey == rowKeyToActOn &&
                !!expandedConversationViewState?.forks &&
                expandedConversationViewState.forks.length > 0
                    ? expandedConversationViewState.forks
                    : await getForksInConversation(
                          conversationIdString,
                          parentFolderId,
                          null /*mailboxInfo*/
                      );
        }
        if (forks.length > 0) {
            // Mark the top fork item as read, rely on row notifications to fill actual isRead property for ancestors of forks
            markItemsAsReadStoreUpdate(
                [itemId],
                isReadValue /*isReadValue*/,
                false /*isExplicit*/,
                tableView.id
            );
            const forkToMarkAsRead = getForkBasedOnItemId(itemId, forks);
            if (forkToMarkAsRead) {
                markForksAsRead(
                    [forkToMarkAsRead],
                    tableView,
                    isReadValue /*isReadValue*/,
                    false /*isExplicit*/,
                    null /*actionSource*/
                );
            }
        } else {
            // If there are no forks, mark the conversation as read
            await autoMarkConversationAsRead(conversationIdString, tableView);
        }
    } else {
        getAncestorsOfMessageIncludingCurrentItem(
            tableView.tableQuery.folderId,
            conversationIdString,
            itemId
        ).then((itemIdsToMark: string[]) => {
            markItemsAsReadBasedOnItemIds(
                tableView,
                itemIdsToMark,
                isReadValue /*isReadValue*/,
                false /* isExplicit */,
                null /* actionSource */,
                [] /* instrumentationContexts */
            );
        });
    }
}
