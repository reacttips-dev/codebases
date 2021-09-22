import { MailFolderTableQuery, TableQuery, TableQueryType } from 'owa-mail-list-store';
import type { SearchTableQuery } from 'owa-mail-list-search';

export default function getTableId(tableQuery: TableQuery, ignoreSort: boolean = false): string {
    const tableId = [];
    switch (tableQuery.type) {
        case TableQueryType.Folder:
            tableId.push('folderId:' + tableQuery.folderId);

            const mailTableQuery = tableQuery as MailFolderTableQuery;
            tableId.push('lVT:' + tableQuery.listViewType);
            tableId.push('vF:' + mailTableQuery.viewFilter);
            tableId.push('fVF:' + mailTableQuery.focusedViewFilter);
            if (!ignoreSort) {
                tableId.push('sC:' + mailTableQuery.sortBy.sortColumn);
                tableId.push('sD:' + mailTableQuery.sortBy.sortDirection);
            }

            if (mailTableQuery.categoryName) {
                tableId.push('catName:' + mailTableQuery.categoryName);
            }

            tableId.push('sT:' + mailTableQuery.scenarioType);
            break;

        case TableQueryType.Search:
            tableId.push('folderId:' + tableQuery.folderId);

            const searchTableQuery = tableQuery as SearchTableQuery;
            tableId.push('id:' + searchTableQuery.searchNumber);
            tableId.push('query:' + searchTableQuery.queryString);
            tableId.push('lVT:' + tableQuery.listViewType);
            tableId.push('sT:' + searchTableQuery.scenarioType);
            break;

        case TableQueryType.Group:
            tableId.push('gId:' + tableQuery.folderId);

            const groupMailTableQuery = tableQuery as MailFolderTableQuery;
            tableId.push('lVT:' + tableQuery.listViewType);
            tableId.push('vF:' + groupMailTableQuery.viewFilter);
            break;
    }

    return tableId.join(';').toString();
}
