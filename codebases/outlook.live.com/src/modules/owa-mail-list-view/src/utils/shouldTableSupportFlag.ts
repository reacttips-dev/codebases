import { isGroupTableQuery } from 'owa-group-utils';
import { TableQuery, TableQueryType } from 'owa-mail-list-store';

export function shouldTableSupportFlag(tableQuery: TableQuery) {
    // Support flagging in Search and Folder
    return (
        !isGroupTableQuery(tableQuery) &&
        (tableQuery.type == TableQueryType.Search || tableQuery.type == TableQueryType.Folder)
    );
}
