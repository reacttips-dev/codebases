import type { TableView } from 'owa-mail-list-store';
import { action } from 'satcheljs';

/**
 * Initialize selection on load
 * @param tableView where the operation is being performed
 */
export const initTableSelectionOnLoad = action(
    'INIT_TABLE_SELECTION_ON_LOAD',
    (tableView: TableView) => ({
        tableView,
    })
);
