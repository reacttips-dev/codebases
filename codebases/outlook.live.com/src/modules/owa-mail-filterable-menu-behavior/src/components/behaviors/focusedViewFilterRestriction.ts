import type FocusedViewFilter from 'owa-service/lib/contract/FocusedViewFilter';
import type TableView from 'owa-mail-list-store/lib/store/schema/TableView';
import { getSelectedTableView, getFocusedFilterForTable } from 'owa-mail-list-store';

export const focusedViewFilterRestriction = (focusedViewFilterList: FocusedViewFilter[]) => () => {
    // Check if focusedViewFilter restrictions are to be applied
    const tableView: TableView = getSelectedTableView();
    return focusedViewFilterList.includes(getFocusedFilterForTable(tableView));
};
