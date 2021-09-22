import listViewStore from '../store/Store';
import { TableQueryType } from '../store/schema/TableQuery';

/* When comparing an message's parentFolderId with a tableView's folder id,
a group needs to use its serverFolderId for comparison */
export default function getFolderIdForParentComparison(tableViewId: string): string {
    const tableView = listViewStore.tableViews.get(tableViewId);

    switch (tableView?.tableQuery.type) {
        case TableQueryType.Group:
            return tableView.serverFolderId;
        case TableQueryType.Folder:
            return tableView.tableQuery.folderId;
        default:
            return null;
    }
}
