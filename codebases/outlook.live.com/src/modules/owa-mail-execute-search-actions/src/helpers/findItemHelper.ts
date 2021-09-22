import type { MailFolderTableQuery, TableView } from 'owa-mail-list-store';
import type { SearchTableQuery } from 'owa-mail-list-search';
import type QueryStringType from 'owa-service/lib/contract/QueryStringType';
import { getMailboxInfoFromTableQuery } from 'owa-mail-mailboxinfo';
import indexedPageView from 'owa-service/lib/factory/indexedPageView';
import propertyUri from 'owa-service/lib/factory/propertyUri';
import type SortResults from 'owa-service/lib/contract/SortResults';
import sortResults from 'owa-service/lib/factory/sortResults';
import type { FoldersSearchScope } from 'owa-mail-search';
import { getSearchRestrictions } from 'owa-search-service';
import { getMailboxRequestOptions } from 'owa-request-options-types';

const MAX_RESULTS_COUNT = 50;

export default function getFindItemSearchParams(tableView: TableView, offset: number) {
    const mailTableQuery = tableView.tableQuery as MailFolderTableQuery;
    const searchTableQuery = tableView.tableQuery as SearchTableQuery;
    const queryStringData: QueryStringType = {
        Value: searchTableQuery.queryString,
        MaxResultsCount: MAX_RESULTS_COUNT,
        ResetCache: true,
        ReturnDeletedItems: true,
        ReturnHighlightTerms: true,
        WaitForSearchComplete: true,
    };

    const paging = indexedPageView({
        BasePoint: 'Beginning',
        Offset: offset,
        MaxEntriesReturned: MAX_RESULTS_COUNT,
    });

    const mailboxInfo = getMailboxInfoFromTableQuery(mailTableQuery);
    const requestInit = getMailboxRequestOptions(mailboxInfo);
    const sortByResults: SortResults[] = [];
    sortByResults.push(
        sortResults({
            Order: 'Descending',
            Path: propertyUri({ FieldURI: 'DateTimeReceived' }),
        })
    );
    const folderId = (searchTableQuery.searchScope as FoldersSearchScope).folderId;

    const refinerRestriction = getSearchRestrictions(
        searchTableQuery.fromDate,
        searchTableQuery.toDate,
        null /* upperBoundFieldUri*/,
        null /* lowerBoundFieldUri */
    );

    return {
        queryStringData: queryStringData,
        paging: paging,
        requestInit: requestInit,
        sortByResults: sortByResults,
        folderId: folderId,
        refinerRestriction: refinerRestriction,
    };
}
