import { mutator } from 'satcheljs';
import * as mailListSelectionActionsV2 from 'owa-mail-actions/lib/mailListSelectionActions';

export default mutator(mailListSelectionActionsV2.resetSelectionOnTable, actionMessage => {
    const tableView = actionMessage.tableView;
    tableView.selectedRowKeys.clear();
    tableView.isInCheckedMode = false;
});

export type { TableView } from 'owa-mail-list-store';
