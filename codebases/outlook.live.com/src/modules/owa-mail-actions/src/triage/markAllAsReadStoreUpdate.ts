import { action } from 'satcheljs';
import type { TableView } from 'owa-mail-list-store';

export default action(
    'MARK_ALL_AS_READ_STORE_UPDATE',
    (tableView: TableView, markAsRead: boolean, rowIdsToExclude?: string[]) => ({
        tableView,
        markAsRead,
        rowIdsToExclude,
    })
);
