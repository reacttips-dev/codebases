import { TableView, getFocusedFilterForTable } from '../index';
import FocusedViewFilter from 'owa-service/lib/contract/FocusedViewFilter';
import type ViewFilter from 'owa-service/lib/contract/ViewFilter';

// This helps determine whether the table view is filtered or not based on focused inbox
// view filter like unread, to me , flagged etc but not category favorited folder.
export default function isFilteredTableView(tableView: TableView, viewFilter: ViewFilter): boolean {
    if (!tableView) {
        return null;
    }

    return (
        getFocusedFilterForTable(tableView) !== FocusedViewFilter.None ||
        (viewFilter !== 'All' && viewFilter !== 'UserCategory')
    );
}
