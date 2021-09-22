import { TableView, MailRowDataPropertyGetter } from 'owa-mail-list-store';

export default function getFirstUnpinnedRowIndex(tableView: TableView, startIndex: number) {
    // Find the last pinned item
    let i;
    for (i = startIndex; i < tableView.rowKeys.length; i++) {
        if (!MailRowDataPropertyGetter.getIsPinned(tableView.rowKeys[i], tableView)) {
            break;
        }
    }

    return i;
}
