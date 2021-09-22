import FocusedViewFilter from 'owa-service/lib/contract/FocusedViewFilter';
import { TableQueryType } from '../store/schema/TableQuery';
import type MailFolderTableQuery from '../store/schema/MailFolderTableQuery';
import type TableView from '../store/schema/TableView';

/**
 * Gets the focused view filter for the given table
 * @returns the focused view filter
 */
export default function getFocusedFilterForTable(tableView: TableView): FocusedViewFilter {
    // In deeplink or filehub, the tableView may be empty.
    if (!tableView) {
        return null;
    }

    switch (tableView.tableQuery.type) {
        case TableQueryType.Folder:
        case TableQueryType.Group:
            return (tableView.tableQuery as MailFolderTableQuery).focusedViewFilter;

        case TableQueryType.Search:
            return FocusedViewFilter.None;

        default:
            throw new Error('Table Query should be either of type search, mail folder or group');
    }
}
