import { isGroupTableQuery } from '../index';
import { getSelectedTableView } from 'owa-mail-list-store';

export default function isGroupTableSelected() {
    const selectedTable = getSelectedTableView();
    return selectedTable && isGroupTableQuery(selectedTable.tableQuery);
}
