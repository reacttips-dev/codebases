import { findItemSearch, setHighlightTerms } from '../actions/internalActions';
import getFindItemSearchParams from '../helpers/findItemHelper';
import findItemSearchService from '../services/findItemSearchService';
import {
    ARCHIVE_FOLDER_ROOT_DISTINGUISHED_ID,
    PRIMARY_FOLDER_ROOT_DISTINGUISHED_ID,
} from 'owa-folders-constants';
import type { SearchTableQuery } from 'owa-mail-list-search';
import { getIsSearchTableShown } from 'owa-mail-list-store';
import { mailSearchStore } from 'owa-mail-search';
import { mapTableQueryToTableViewOptions } from 'owa-mail-tableview-options';
import type ItemQueryTraversal from 'owa-service/lib/contract/ItemQueryTraversal';
import folderIdToName from 'owa-session-store/lib/utils/folderIdToName';
import * as trace from 'owa-trace';
import { orchestrator } from 'satcheljs';

export default orchestrator(findItemSearch, async actionMessage => {
    const {
        tableView,
        onInitialTableLoadComplete,
        onLoadInitialRowsSucceeded,
        offset,
    } = actionMessage;

    const {
        queryStringData,
        paging,
        requestInit,
        sortByResults,
        folderId,
        refinerRestriction,
    } = getFindItemSearchParams(tableView, offset);

    const folderName = folderId && folderIdToName(folderId);
    const traversal: ItemQueryTraversal =
        folderName === ARCHIVE_FOLDER_ROOT_DISTINGUISHED_ID ||
        folderName === PRIMARY_FOLDER_ROOT_DISTINGUISHED_ID
            ? 'SoftDeleted' // A SoftDeleted Traversal means to fetch items from the root folder and all the sub folders
            : 'Shallow';

    let responseMessage;
    try {
        responseMessage = await findItemSearchService(
            folderId,
            queryStringData,
            paging,
            'All' /* viewFilter */,
            sortByResults,
            -1 /* focusedViewFilter */,
            requestInit,
            traversal,
            refinerRestriction
        );
    } catch (error) {
        trace.errorThatWillCauseAlert('Find item search call failed ' + error);
        return Promise.resolve(null);
    }
    if (!responseMessage) {
        return;
    }

    // We do not proceed with processing the search response if
    // 1. User has already navigated out of search
    // 2. User has started a new search
    if (
        !getIsSearchTableShown() ||
        (tableView.tableQuery as SearchTableQuery).searchNumber !== mailSearchStore.searchNumber
    ) {
        return;
    }

    const isSuccessResponseClass = responseMessage.ResponseClass === 'Success';
    if (isSuccessResponseClass) {
        onLoadInitialRowsSucceeded(
            tableView,
            responseMessage.RootFolder.Items,
            responseMessage.RootFolder.TotalItemsInView,
            responseMessage.SearchFolderId,
            null /* FolderId used for groups scenario, we currently don't support message view in groups. */
        );
        // Highlight the search terms if required
        if (
            responseMessage.HighlightTerms &&
            !tableView.highlightTerms &&
            mapTableQueryToTableViewOptions(tableView.tableQuery).shouldHighlight
        ) {
            setHighlightTerms(responseMessage.HighlightTerms.map(term => term.Value));
        }
    }

    // This action is responsible for handling the failure case also
    onInitialTableLoadComplete(
        tableView,
        isSuccessResponseClass,
        responseMessage.ResponseCode,
        false /* isTablePrefetched */
    );
});
