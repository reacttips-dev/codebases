import { orchestrator } from 'satcheljs';
import { loadMoreFindItemSearch } from '../actions/publicActions';
import findItemSearchService from '../services/findItemSearchService';
import { appendItemWithSeekToConditionResponse } from 'owa-mail-list-response-processor';
import { getIsSearchTableShown } from 'owa-mail-list-store';
import { mailSearchStore } from 'owa-mail-search';
import * as trace from 'owa-trace';
import type { SearchTableQuery } from 'owa-mail-list-search';
import getFindItemSearchParams from '../helpers/findItemHelper';
import ItemQueryTraversal from 'owa-service/lib/contract/ItemQueryTraversal';
import folderIdToName from 'owa-session-store/lib/utils/folderIdToName';
import {
    ARCHIVE_FOLDER_ROOT_DISTINGUISHED_ID,
    PRIMARY_FOLDER_ROOT_DISTINGUISHED_ID,
} from 'owa-folders-constants';

export default orchestrator(loadMoreFindItemSearch, async actionMessage => {
    const { tableView, onLoadMoreRowsSucceeded, onLoadMoreRowsFailed, offset } = actionMessage;

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
        trace.errorThatWillCauseAlert('Load more Find item search call failed ' + error);
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
        onLoadMoreRowsSucceeded(
            tableView,
            responseMessage.RootFolder.Items,
            responseMessage.RootFolder.TotalItemsInView,
            appendItemWithSeekToConditionResponse
        );
    } else {
        onLoadMoreRowsFailed(tableView, responseMessage.ResponseCode);
    }
});
