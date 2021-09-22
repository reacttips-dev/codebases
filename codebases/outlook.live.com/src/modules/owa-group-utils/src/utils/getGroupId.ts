import { getSelectedTableView, TableQueryType, TableView } from 'owa-mail-list-store';

export function getSelectedGroupId(): string {
    const tableView = getSelectedTableView();
    return getGroupId(tableView);
}

export function getGroupId(tableView: TableView): string {
    return tableView && tableView.tableQuery.type == TableQueryType.Group
        ? tableView.tableQuery.folderId
        : null;
}
