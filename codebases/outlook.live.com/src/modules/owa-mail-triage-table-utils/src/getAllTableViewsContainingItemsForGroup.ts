import type { ObservableMap } from 'mobx';
import { getGroupIdFromTableQuery } from 'owa-group-utils';
import { listViewStore, TableView, TableQueryType } from 'owa-mail-list-store';

export interface GetAllTableViewsContainingItemsForGroupState {
    tableViews: ObservableMap<string, TableView>;
}

/**
 * Get all the table views that may contain items from the given group
 * @param the group id
 * @param shouldIncludeSearchTable - whether to include the search table in the table list being returned
 * @param the GetAllTableViewsContainingItemsForGroupState used for getAllTableViews
 */
export default function getAllTableViewsContainingItemsForGroup(
    groupId: string,
    shouldIncludeSearchTable: boolean,
    state: GetAllTableViewsContainingItemsForGroupState = { tableViews: listViewStore.tableViews }
): TableView[] {
    const { tableViews } = state;
    const allTableViewsOfGroup = [];
    tableViews.forEach(tableView => {
        // Include search table if specified
        if (
            getGroupIdFromTableQuery(tableView.tableQuery) == groupId ||
            (shouldIncludeSearchTable && tableView.tableQuery.type == TableQueryType.Search)
        ) {
            allTableViewsOfGroup.push(tableView);
        }
    });
    return allTableViewsOfGroup;
}
