import type { TableView } from '../index';
import type { InstrumentationContext } from 'owa-search/lib/types/InstrumentationContext';
import { getInstrumentationContext } from '../selectors/mailRowDataPropertyGetter';

/**
 *
 * @param rowKeys string[] holding rowKeys from tableView
 * @param tableView tableView containing rowKeys
 */
export default function getInstrumentationContextsFromTableView(
    rowKeys: string[],
    tableView: TableView
): InstrumentationContext[] {
    return rowKeys.map(rowKey => getInstrumentationContext(rowKey, tableView)).filter(ic => ic);
}
