import listViewStore from '../store/Store';
import { getRowIdString } from '../selectors/mailRowDataPropertyGetter';

/**
 * Returns a collection of the rowIdStrings for the given rowKeys
 * @param rowKeys rowKeys to get rowIds for
 * @param tableView tableView to loop up
 */
export default function getRowIdsFromRowKeys(rowKeys: string[], tableViewId: string): string[] {
    const tableView = listViewStore.tableViews.get(tableViewId);

    // Convert and remove null cases
    const rowIdStrings = rowKeys.map(key => getRowIdString(key, tableView)).filter(key => key);

    // In case of multi-value sorts there can be two rows with same conversation/item
    // Hence we have to dedup the ids
    return rowIdStrings.filter((item, pos) => rowIdStrings.indexOf(item) == pos);
}
