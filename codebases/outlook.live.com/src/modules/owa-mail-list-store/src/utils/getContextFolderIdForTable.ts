import type TableView from '../store/schema/TableView';
import { TableQueryType } from '../store/schema/TableQuery';
import { isFeatureEnabled } from 'owa-feature-flags';
import { isFavoritesSearchFolderScenario } from '../selectors/isFavoritesSearchFolderScenario';
import type MailFolderTableQuery from '../store/schema/MailFolderTableQuery';

/**
 * @param tableView for which we want to get the context folder id
 * @param returnFolderScopeIfEnabled returns context folder id as the original folder Id if the flight is enabled
 * @return Returns folderId for the table view
 */
export default function getContextFolderIdForTable(
    tableView: TableView,
    returnFolderScopeIfEnabled?: boolean
): string {
    switch (tableView.tableQuery.type) {
        case TableQueryType.Folder:
            const scenarioType = (tableView.tableQuery as MailFolderTableQuery).scenarioType;
            if (
                isFeatureEnabled('tri-triageFolderScope') &&
                returnFolderScopeIfEnabled &&
                !isFavoritesSearchFolderScenario(scenarioType)
            ) {
                return tableView.tableQuery.folderId;
            }
            return tableView.serverFolderId;

        case TableQueryType.Search:
        case TableQueryType.Group:
        default:
            return null;
    }
}
