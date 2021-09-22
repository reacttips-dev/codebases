import { getSelectedTableView, TableQueryType } from 'owa-mail-list-store';

export default function isGroupSelected(): boolean {
    const selectedTable = getSelectedTableView();
    return selectedTable && selectedTable.tableQuery.type == TableQueryType.Group;
}
