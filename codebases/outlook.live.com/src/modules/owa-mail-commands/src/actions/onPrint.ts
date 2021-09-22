import { listViewStore, MailRowDataPropertyGetter } from 'owa-mail-list-store';
import type { ActionSource } from 'owa-analytics-types';
import { lazyPrintConversation, lazyPrintItem } from 'owa-mail-message-actions';
import ReactListViewType from 'owa-service/lib/contract/ReactListViewType';
import { lazyResetFocus } from 'owa-mail-focus-manager';

export default function onPrint(actionSource: ActionSource, targetWindow?: Window) {
    const tableViewId = listViewStore.selectedTableViewId;
    const tableView = listViewStore.tableViews.get(tableViewId)!;
    const rowKeys = [...tableView.selectedRowKeys.keys()];

    const selectedRowId = MailRowDataPropertyGetter.getRowClientItemId(rowKeys[0], tableView);
    switch (tableView.tableQuery.listViewType) {
        case ReactListViewType.Conversation:
            lazyPrintConversation.importAndExecute(
                selectedRowId /* conversationId */,
                actionSource,
                targetWindow
            );
            break;

        case ReactListViewType.Message:
            lazyPrintItem.importAndExecute(selectedRowId /* itemId */, actionSource, targetWindow);
            break;
    }

    lazyResetFocus.importAndExecute();
}
