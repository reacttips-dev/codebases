import {
    MailFolderTableQuery,
    TableQueryType,
    TableView,
    listViewStore,
} from 'owa-mail-list-store';
import type { ObservableMap } from 'mobx';

export interface GetAllTableViewsContainingItemsForFolderState {
    tableViews: ObservableMap<string, TableView>;
}

/**
 * Get all the table views that may contain items from the given folder
 * @param the folder id
 * @param shouldIncludeSearchTable - whether to include the search table in the table list being returned
 * @param the GetAllTableViewsContainingItemsForFolderState used for getAllTableViews
 */
export default function getAllTableViewsContainingItemsForFolder(
    folderId: string,
    shouldIncludeSearchTable: boolean,
    state: GetAllTableViewsContainingItemsForFolderState = { tableViews: listViewStore.tableViews }
): TableView[] {
    const { tableViews } = state;
    const allTableViewsOfFolder = [];
    tableViews.forEach(tableView => {
        // Include search table if specified
        if (
            tableView.tableQuery.folderId === folderId ||
            tableView.serverFolderId === folderId ||
            (shouldIncludeSearchTable && tableView.tableQuery.type === TableQueryType.Search)
        ) {
            allTableViewsOfFolder.push(tableView);
        } else if (shouldIncludeSearchTable) {
            // favorited category and persona folders are of mail table query type, except when it's initially
            // created, which issues a search table query as fallback instead
            // search tables are not only returned by search table query calls, they can also be returned
            // by the FindItem/FindConversation mail table query calls
            const mailTableQueryScenario = (tableView.tableQuery as MailFolderTableQuery)
                .scenarioType;
            if (
                mailTableQueryScenario === 'category' ||
                mailTableQueryScenario === 'persona' ||
                mailTableQueryScenario === 'privatedistributionlist'
            ) {
                allTableViewsOfFolder.push(tableView);
            }
        }
    });
    return allTableViewsOfFolder;
}
