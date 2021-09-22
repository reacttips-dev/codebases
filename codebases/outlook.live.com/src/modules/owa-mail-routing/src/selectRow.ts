import { singleSelectRow } from 'owa-mail-actions/lib/mailListSelectionActions';
import { getRowKeysFromRowIds } from 'owa-mail-list-store';
import getSelectedTableView from 'owa-mail-list-store/lib/utils/getSelectedTableView';
import MailListItemSelectionSource from 'owa-mail-store/lib/store/schema/MailListItemSelectionSource';

export default function selectRow(rowId: string) {
    const tableView = getSelectedTableView();
    const rowKey = getRowKeysFromRowIds([rowId], tableView)[0];

    if (tableView.rowKeys.includes(rowKey)) {
        singleSelectRow(
            tableView,
            rowKey,
            true /* isUserNavigation */,
            MailListItemSelectionSource.RouteHandler
        );
    }

    // 2017: Reading Pane: Conversation route handler for conversations moved\deleted or hasn't been loaded by listview
}
