import { onAddTable, onRemoveTable } from './onUpdateTables';
import { getTableViewFromTableQuery } from 'owa-mail-triage-table-utils';
import type { TableQuery } from 'owa-mail-list-store';

/*
    We maintain a list of always cached tables here. When we add a table that should always be
    cached, we subscribe to the row notifications.
*/

const currentInboxes = new Map<string, string>();

export function set(inboxView: string, tableQuery: TableQuery, forceReplacement = false) {
    if (currentInboxes.has(inboxView) && forceReplacement) {
        onRemoveTable(currentInboxes.get(inboxView));
    }

    if (!currentInboxes.has(inboxView) || forceReplacement) {
        const tableView = getTableViewFromTableQuery(tableQuery);
        currentInboxes.set(inboxView, tableView.id);

        onAddTable(tableView);
    }
}

export function clear(inboxView: string) {
    const tableViewId = currentInboxes.get(inboxView);
    if (tableViewId && currentInboxes.delete(inboxView)) {
        // Remove table from store and unsubscribe
        onRemoveTable(tableViewId);
    }
}

export function has(inboxView: string) {
    return currentInboxes.has(inboxView);
}
