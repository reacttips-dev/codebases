import getAllTableViewsContainingItemsForFolder from 'owa-mail-triage-table-utils/lib/getAllTableViewsContainingItemsForFolder';
import * as mruTableIdList from './tableCache/mruTableIdList';

export default function removeFolderInListViewStore(folderId: string) {
    // delete all the table views for the current folder
    const tableViewsForCurrentFolder = getAllTableViewsContainingItemsForFolder(
        folderId,
        false /* shouldIncludeSearchTable */
    );
    tableViewsForCurrentFolder.forEach(tableView => mruTableIdList.remove(tableView));
}
