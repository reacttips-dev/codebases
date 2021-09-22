import updateTableCurrentLoadedIndex from 'owa-mail-triage-table-utils/lib/actions/updateTableCurrentLoadedIndex';
import { getStore } from 'owa-mail-list-store';
import { mutator } from 'satcheljs';

export default mutator(updateTableCurrentLoadedIndex, actionMessage => {
    const tableView = getStore().tableViews.get(actionMessage.tableViewId);
    tableView.currentLoadedIndex = actionMessage.currentLoadedIndexToSet;
});
