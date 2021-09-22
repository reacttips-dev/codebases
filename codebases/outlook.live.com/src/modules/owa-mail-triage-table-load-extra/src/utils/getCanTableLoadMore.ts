import tombstoneOperations, { TombstoneReasonType } from 'owa-mail-list-tombstone';
import { isBulkActionInState, BulkActionStateEnum } from 'owa-bulk-action-store';
import type { TableView, MailFolderTableQuery } from 'owa-mail-list-store';

export function getCanTableLoadMore(tableView: TableView): boolean {
    // If bulk operation is running in this folder, do not load more
    if (isBulkActionInState(tableView.serverFolderId, BulkActionStateEnum.Running)) {
        return false;
    }

    // We have more items in the store locally outside of loaded range, so we can load more
    if (tableView.currentLoadedIndex < tableView.rowKeys.length) {
        return true;
    }

    // If we're in the "Important" filter, then all items are loaded.
    const scenarioType = (tableView?.tableQuery as MailFolderTableQuery)?.scenarioType;
    if (scenarioType === 'spotlight') {
        return false;
    }

    // there is a brief period of time where immediately after client item deletion and before server
    // notification comes in, client totalRowsInView count is out of sync with server
    // this code accounts for the in progress delete count so that client does not trigger unnecessary load more calls
    const inProgressDeleteRowsCount = tombstoneOperations.getCount(
        tableView.serverFolderId,
        TombstoneReasonType.RowRemove
    );

    // If we have no more items locally in store, check if there are more items on server
    // We can only support load more SeekToCondition request if we have any items left on the client
    // VSO 12854: Listview should load more if user deletes all items that's on the client but the server has more rows
    return (
        tableView.rowKeys.length > 0 &&
        tableView.rowKeys.length < tableView.totalRowsInView - inProgressDeleteRowsCount
    );
}
