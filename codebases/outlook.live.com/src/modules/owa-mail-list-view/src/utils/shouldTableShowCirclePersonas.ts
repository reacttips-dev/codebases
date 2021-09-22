import { getIsBitSet, ListViewBitFlagsMasks } from 'owa-bit-flags/lib/utils/listViewBitFlagsUtil';
import { MailSortHelper, TableQuery, TableQueryType } from 'owa-mail-list-store';
import type { SearchTableQuery } from 'owa-mail-list-search';
import folderNameToId from 'owa-session-store/lib/utils/folderNameToId';
import { SearchScopeKind } from 'owa-search-service/lib/data/schema/SearchScope';
import { getUserConfiguration } from 'owa-session-store';

/**
 *
 * Returns a flag indicating whether to show the circle personas in this table
 * 1. Hide sender images in message list option is disabled
 * 2. if in search state, current scope is not drafts or sentitems
 * 3. current folder is not drafts, sentitems
 * 4. current table is not sorted by a multi value sort such as "From"
 * @param tableQuery - the table query
 */
export default function shouldTableShowCirclePersonas(tableQuery: TableQuery): boolean {
    const userConfiguration = getUserConfiguration();
    if (
        getIsBitSet(ListViewBitFlagsMasks.HideSenderImage) ||
        !userConfiguration.SegmentationSettings.DisplayPhotos
    ) {
        return false;
    } else if (tableQuery.type == TableQueryType.Search) {
        const searchTableQuery = tableQuery as SearchTableQuery;
        const scenarioType = (tableQuery as SearchTableQuery).scenarioType;

        if (scenarioType === 'persona' || scenarioType === 'privateDistributionList') {
            // For persona and PDL scenario we want to align to results from persona search folder and show circle personas always
            return true;
        }

        return (
            (searchTableQuery.searchScope.kind == SearchScopeKind.PrimaryMailbox &&
                searchTableQuery.searchScope.folderId != folderNameToId('drafts') &&
                searchTableQuery.searchScope.folderId != folderNameToId('sentitems')) ||
            searchTableQuery.searchScope.kind == SearchScopeKind.ArchiveMailbox ||
            searchTableQuery.searchScope.kind == SearchScopeKind.SharedFolders
        );
    } else {
        return (
            tableQuery.folderId != folderNameToId('drafts') &&
            tableQuery.folderId != folderNameToId('sentitems') &&
            !MailSortHelper.isTableMultiValueSort(tableQuery)
        );
    }
}
