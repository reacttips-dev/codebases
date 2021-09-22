import type TableView from '../store/schema/TableView';
import { TableQueryType } from '../store/schema/TableQuery';
import type SortBy from '../store/schema/SortBy';
import type MailFolderTableQuery from '../store/schema/MailFolderTableQuery';

/**
 * Gets the sort by property for the given table
 * @param tableView for which to find the soryBy
 * @returns the sortBy property for the given table
 */
export default function getSortByForTable(tableView: TableView): SortBy {
    switch (tableView.tableQuery.type) {
        case TableQueryType.Folder:
        case TableQueryType.Group:
            return (tableView.tableQuery as MailFolderTableQuery).sortBy;

        default:
            throw new Error(
                'getSortByForTable: Table Query type should be either of type group, or mail folder'
            );
    }
}
