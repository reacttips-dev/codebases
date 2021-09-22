import getSelectedTableView from './getSelectedTableView';
import { TableQueryType } from '../store/schema/TableQuery';

/**
 * Whether list view is currently showing search table
 * @return flag indicating whether list view is currently showing search table
 */
export default function getIsSearchTableShown(): boolean {
    const tableView = getSelectedTableView();
    // VSO 29875 tableView is null fileshub/photohub search boxes
    if (tableView) {
        return tableView.tableQuery.type === TableQueryType.Search;
    }

    return false;
}
