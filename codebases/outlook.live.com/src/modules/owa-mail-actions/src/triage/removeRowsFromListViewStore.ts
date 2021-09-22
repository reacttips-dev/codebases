import type TableView from 'owa-mail-list-store/lib/store/schema/TableView';
import { action } from 'satcheljs';
import type { ActionType } from './userMailInteractionAction';

/**
 * Action to propagate the remove rows from listview store
 * @param rowKeys - the rows keus
 * @param tableView - the current tableView
 * @param actionType - action that prompted the row removal
 * @param shouldRemoveFromAllTables - determines if row should be removed from all tables or just the one represented by the tableView param
 */
export default action(
    'REMOVE_ROWS_FROM_LISTVIEW_STORE',
    (
        rowKeys: string[],
        tableView: TableView,
        actionType: ActionType | string,
        shouldRemoveFromAllTables: boolean = true
    ) => {
        return {
            rowKeys,
            tableView,
            actionType,
            shouldRemoveFromAllTables,
        };
    }
);
