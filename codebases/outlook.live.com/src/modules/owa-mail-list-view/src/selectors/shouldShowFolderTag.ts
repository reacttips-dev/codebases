import {
    isFavoritesSearchFolderScenario,
    TableQuery,
    TableQueryType,
    MailFolderTableQuery,
} from 'owa-mail-list-store';

export default function shouldShowFolderTag(tableQuery: TableQuery): boolean {
    // Show folder tags if user is in a persona or category folder
    if (tableQuery.type === TableQueryType.Folder) {
        const { scenarioType } = tableQuery as MailFolderTableQuery;
        return isFavoritesSearchFolderScenario(scenarioType);
    }

    // .... or in search results
    return tableQuery.type === TableQueryType.Search;
}
