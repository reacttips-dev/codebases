import { listViewStore, MailRowDataPropertyGetter } from 'owa-mail-list-store';
import type { ActionSource } from 'owa-analytics-types';
import ReactListViewType from 'owa-service/lib/contract/ReactListViewType';
import { lazyShowConversationInImmersiveReader } from 'owa-mail-message-actions';
import { lazyShowInImmersiveReader } from 'owa-immersive-reader-store';

export default function onShowInImmersiveReader(actionSource: ActionSource) {
    const tableViewId = listViewStore.selectedTableViewId;
    const tableView = listViewStore.tableViews.get(tableViewId)!;
    const rowKeys = [...tableView.selectedRowKeys.keys()];
    const selectedRowId = MailRowDataPropertyGetter.getRowClientItemId(rowKeys[0], tableView);

    switch (tableView.tableQuery.listViewType) {
        case ReactListViewType.Conversation:
            lazyShowConversationInImmersiveReader.importAndExecute(
                selectedRowId /* conversationId */,
                actionSource
            );
            break;

        case ReactListViewType.Message:
            lazyShowInImmersiveReader.importAndExecute(selectedRowId /* itemId */, actionSource);
            break;
    }
}
