import { findItem } from './findItem';
import type BaseFolderId from 'owa-service/lib/contract/BaseFolderId';
import type FindItemResponseMessage from 'owa-service/lib/contract/FindItemResponseMessage';
import type FocusedViewFilter from 'owa-service/lib/contract/FocusedViewFilter';
import type ItemResponseShape from 'owa-service/lib/contract/ItemResponseShape';
import type FolderId from 'owa-service/lib/contract/FolderId';
import type SortResults from 'owa-service/lib/contract/SortResults';
import type ViewFilter from 'owa-service/lib/contract/ViewFilter';
import indexedPageView from 'owa-service/lib/factory/indexedPageView';
import { getFindItemTraversal } from './utils/getFindItemTraversal';
import type RequestOptions from 'owa-service/lib/RequestOptions';
import folderNameToId from 'owa-session-store/lib/utils/folderNameToId';
import type { SessionData } from 'owa-service/lib/types/SessionData';
import { extractFindMailFolderItemResponse } from './utils/extractFindMailFolderItemResponse';

/**
 * The FindItemWithStartIndex is used today to load rows when we want to load them from the beginning (or 0th index)
 * This is currently used in load initial rows and in reload scenarios
 * @param baseFolderId the base folder id
 * @param startIndex the startIndex to load the table
 * @param paging the paging type
 * @param viewFilter the view filter
 * @param sortResults the primary and secondary sort by results
 * @param focusedViewFilter the focused view filter
 * @param findItemShapeName - the shape for the request
 * @param initialSessionData The initial session data which is only present during the initial bootstrap
 * @param options - optional parameters to be passed to request (method and/or headers)
 * @param categoryName - the category name
 * @param searchFolderId the search folder id
 * @returns a promise of type FindItemResponseMessage
 */
export function findItemWithStartIndex(
    baseFolderId: BaseFolderId,
    startIndex: number,
    rowsToLoad: number,
    viewFilter: ViewFilter,
    sortResults: SortResults[],
    focusedViewFilter: FocusedViewFilter,
    findItemShapeName: string,
    initialSessionData: SessionData | undefined,
    options: RequestOptions | null | undefined,
    categoryName: string,
    searchFolderId?: BaseFolderId,
    itemResponseShape?: ItemResponseShape
): Promise<FindItemResponseMessage> {
    if (initialSessionData && (baseFolderId as FolderId).Id == folderNameToId('inbox')) {
        const sessionDataFindMailFolderItemResponse = extractFindMailFolderItemResponse(
            initialSessionData
        );
        if (sessionDataFindMailFolderItemResponse) {
            // Return the session data response if available instead of going to the server
            return Promise.resolve(sessionDataFindMailFolderItemResponse);
        }
    }

    const paging = indexedPageView({
        BasePoint: 'Beginning',
        Offset: 0 /* startIndex */,
        MaxEntriesReturned: rowsToLoad,
    });

    return findItem(
        baseFolderId,
        paging,
        viewFilter,
        sortResults,
        focusedViewFilter,
        findItemShapeName,
        options,
        categoryName,
        getFindItemTraversal(viewFilter),
        searchFolderId,
        itemResponseShape
    );
}
