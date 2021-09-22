import { TableView, MailFolderTableQuery, TableQueryType } from '../index';

// Determines if the table view filter is user category and returns a category name.
export default function getUserCategoryName(tableView: TableView) {
    return tableView.tableQuery.type === TableQueryType.Folder &&
        (tableView.tableQuery as MailFolderTableQuery).viewFilter === 'UserCategory'
        ? (tableView.tableQuery as MailFolderTableQuery).categoryName
        : null;
}
