import type TableView from '../store/schema/TableView';
import getSelectedTableViewId from './getSelectedTableViewId';
import listViewStore from '../store/Store';

/**
 * This function is deprecated as we will move away from global getters.
 * Please pass in the tableView or tableViewId as parameter and call listViewStore.tableViews.get(tableViewId) instead.
 */
export default function getSelectedTableView(): TableView {
    return listViewStore.tableViews.get(getSelectedTableViewId());
}
