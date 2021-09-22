import type { SearchTableQuery } from 'owa-mail-list-search';
import { TableQuery, TableQueryType, MailFolderTableQuery, SortColumn } from 'owa-mail-list-store';
import { assertNever } from 'owa-assert';

export type HeaderGeneratorType =
    | 'DateTime'
    | 'RelevanceHybrid'
    | 'Sender'
    | 'Size'
    | 'Importance'
    | 'Subject';

export interface TableViewOptions {
    shouldHighlight: boolean;
    headerGeneratorType: HeaderGeneratorType;
}

export function mapTableQueryToTableViewOptions(tableQuery: TableQuery): TableViewOptions {
    switch (tableQuery.type) {
        case TableQueryType.Search:
            return getSearchTableQueryOptions(tableQuery as SearchTableQuery);
        case TableQueryType.Folder:
        case TableQueryType.Group:
            return getMailTableQueryOptions(tableQuery as MailFolderTableQuery);
        default:
            return assertNever(tableQuery.type);
    }
}

function getSearchTableQueryOptions(tableQuery: SearchTableQuery): TableViewOptions {
    switch (tableQuery.scenarioType) {
        case 'mail':
        case 'messageSuggestion':
            return { shouldHighlight: true, headerGeneratorType: 'RelevanceHybrid' };
        case 'persona':
        case 'privateDistributionList':
        case 'category':
            return { shouldHighlight: false, headerGeneratorType: 'DateTime' };
        default:
            return assertNever(tableQuery.scenarioType);
    }
}

function getMailTableQueryOptions(tableQuery: MailFolderTableQuery): TableViewOptions {
    let headerGeneratorType: HeaderGeneratorType;

    const tableSortColumn =
        tableQuery.type == TableQueryType.Folder &&
        (tableQuery as MailFolderTableQuery).sortBy.sortColumn;

    switch (tableSortColumn) {
        case SortColumn.From:
            headerGeneratorType = 'Sender';
            break;

        case SortColumn.Size:
            headerGeneratorType = 'Size';
            break;

        case SortColumn.Importance:
            headerGeneratorType = 'Importance';
            break;

        case SortColumn.Subject:
            headerGeneratorType = 'Subject';
            break;

        case SortColumn.Date:
        default: // always fall back to date header generator
        {
            headerGeneratorType = 'DateTime';
            break;
        }
    }

    return { shouldHighlight: true, headerGeneratorType: headerGeneratorType };
}
