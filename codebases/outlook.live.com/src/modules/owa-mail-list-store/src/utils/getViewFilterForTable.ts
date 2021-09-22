import type TableView from '../store/schema/TableView';
import { TableQueryType } from '../store/schema/TableQuery';
import type ViewFilter from 'owa-service/lib/contract/ViewFilter';
import type MailFolderTableQuery from '../store/schema/MailFolderTableQuery';

/**
 * @param tableView for which we want to get the view filter
 * @return Returns the view filter for the table view
 */
export default function getViewFilterForTable(tableView: TableView): ViewFilter {
    // In deeplink or filehub, the tableView may be empty.
    if (!tableView) {
        return null;
    }

    switch (tableView.tableQuery.type) {
        case TableQueryType.Folder:
        case TableQueryType.Group:
        case TableQueryType.Search:
            return (tableView.tableQuery as MailFolderTableQuery).viewFilter;

        default:
            throw new Error('Table Query should be either of type search, mail folder or group');
    }
}
