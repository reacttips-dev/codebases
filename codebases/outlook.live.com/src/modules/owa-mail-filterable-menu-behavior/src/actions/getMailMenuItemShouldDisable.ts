import { MenuItemType } from '../components/MenuItemType';
import {
    getGroupIdFromTableQuery,
    isGroupTableQuery,
    lazyIsGroupOwner,
    lazyIsPrivateUnjoinedGroup,
} from 'owa-group-utils';
import { composeStore } from 'owa-mail-compose-store';
import { isDumpsterSearchTable } from 'owa-mail-list-search';
import {
    isDumpsterTable,
    listViewStore,
    MailRowDataPropertyGetter,
    TableView,
} from 'owa-mail-list-store';
import { isBulkActionRunning } from 'owa-bulk-action-store';

export default function getMailMenuItemShouldDisable(menuItem: MenuItemType): boolean {
    const tableView = listViewStore.tableViews.get(listViewStore.selectedTableViewId);
    switch (menuItem) {
        case MenuItemType.NewMessage:
            return isNewMessageDisabled(tableView);
        case MenuItemType.Delete:
            return isDeleteDisabled(tableView);
        default:
            return false;
    }
}

// Show new message as disabled
// - when we in a dumpster table
// - when we are in a private unjoined group
// - when a new message is still in the process of being created
function isNewMessageDisabled(tableView: TableView): boolean {
    const tableQuery = tableView.tableQuery;
    const isDumpsterOrDumpsterSearchTable =
        isDumpsterTable(tableQuery) || isDumpsterSearchTable(tableQuery);

    if (isDumpsterOrDumpsterSearchTable) {
        return true;
    }

    if (isGroupTableQuery(tableQuery)) {
        const isPrivateUnjoinedGroup = lazyIsPrivateUnjoinedGroup.tryImportForRender();
        return isPrivateUnjoinedGroup?.(getGroupIdFromTableQuery(tableQuery));
    }

    if (composeStore.newMessageCreationInProgress) {
        return true;
    }

    return false;
}

// Show delete as disabled
// - if tableview is in selectAll mode and a bulk action is currently already running
// - when we are in a group, we are not the group owner, AND
// --- we have multiple rows selected OR
// --- we do not have canDelete permissions on the message
function isDeleteDisabled(tableView: TableView): boolean {
    const tableQuery = tableView.tableQuery;

    if (isBulkActionRunning(tableView.serverFolderId) && tableView.isInVirtualSelectAllMode) {
        return true;
    }

    if (isGroupTableQuery(tableQuery)) {
        const isGroupOwner = lazyIsGroupOwner.tryImportForRender();
        if (!isGroupOwner?.(getGroupIdFromTableQuery(tableQuery))) {
            const selectedKeys = [...tableView.selectedRowKeys.keys()];
            if (
                selectedKeys.length !== 1 ||
                !MailRowDataPropertyGetter.getCanDelete(selectedKeys[0], tableView)
            ) {
                return true;
            }
        }
    }

    return false;
}
