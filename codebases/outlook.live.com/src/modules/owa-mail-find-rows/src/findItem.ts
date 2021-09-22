import * as findItemShapeUtil from './utils/findItemShapeUtil';
import type BaseFolderId from 'owa-service/lib/contract/BaseFolderId';
import type BasePagingType from 'owa-service/lib/contract/BasePagingType';
import type FindItemRequest from 'owa-service/lib/contract/FindItemRequest';
import type FindItemResponseMessage from 'owa-service/lib/contract/FindItemResponseMessage';
import type ItemResponseShape from 'owa-service/lib/contract/ItemResponseShape';
import type FocusedViewFilter from 'owa-service/lib/contract/FocusedViewFilter';
import type SortResults from 'owa-service/lib/contract/SortResults';
import type ViewFilter from 'owa-service/lib/contract/ViewFilter';
import findItemRequest from 'owa-service/lib/factory/findItemRequest';
import findItemOperation from 'owa-service/lib/operation/findItemOperation';
import { getJsonRequestHeader } from 'owa-service/lib/ServiceRequestUtils';
import type ItemQueryTraversal from 'owa-service/lib/contract/ItemQueryTraversal';
import type FolderId from 'owa-service/lib/contract/FolderId';
import type RequestOptions from 'owa-service/lib/RequestOptions';

/**
 * Configure the request body
 * @param currentBaseFolderId the current base folder id
 * @param paging the paging type
 * @param viewFilter the view filter
 * @param sortResults the primary and secondary sort by results
 * @param focusedViewFilter the focused view filter
 * @param findItemShapeName the request shape name
 * @param categoryName the category name
 * @param traversal the traverl to use for this find request
 * @param searchFolderId the search folder id
 * @return FindItem request
 */
function configureRequestBody(
    currentBaseFolderId: BaseFolderId,
    paging: BasePagingType,
    viewFilter: ViewFilter,
    sortResults: SortResults[],
    focusedViewFilter: FocusedViewFilter,
    findItemShapeName: string,
    categoryName: string,
    traversal: ItemQueryTraversal,
    searchFolderId?: BaseFolderId,
    itemResponseShape?: ItemResponseShape
): FindItemRequest {
    const folderId = currentBaseFolderId as FolderId;
    const requestData: FindItemRequest = {
        ParentFolderIds: [currentBaseFolderId],
        ItemShape: itemResponseShape || findItemShapeUtil.getFindItemResponseShape(folderId.Id),
        ShapeName: findItemShapeName,
        Traversal: traversal,
        Paging: paging,
        FocusedViewFilter: focusedViewFilter,
        ViewFilter: viewFilter,
        SortOrder: sortResults,
        CategoryFilter: categoryName,
    };

    // add optional request parameter
    if (searchFolderId) {
        requestData.SearchFolderId = searchFolderId;
    }

    return findItemRequest(requestData);
}

/**
 * Find item request
 * @param baseFolderId the base folder id
 * @param paging the paging type
 * @param viewFilter the view filter
 * @param sortResults the primary and secondary sort by results
 * @param focusedViewFilter the focused view filter
 * @param findItemShapeName the request shape name
 * @param options - optional parameters to be passed to request (method and/or headers)
 * @param categoryName the category name
 * @param traversal the traversal to use for this find request
 * @param searchFolderId the search folder id
 * @return promise containing FindItem response
 */
export function findItem(
    baseFolderId: BaseFolderId,
    paging: BasePagingType,
    viewFilter: ViewFilter,
    sortResults: SortResults[],
    focusedViewFilter: FocusedViewFilter,
    findItemShapeName: string,
    options: RequestOptions | null | undefined,
    categoryName: string,
    traversal: ItemQueryTraversal,
    searchFolderId?: BaseFolderId,
    itemResponseShape?: ItemResponseShape
): Promise<FindItemResponseMessage> {
    if (categoryName && viewFilter != 'UserCategory') {
        throw new Error('CategoryName should be set only for UserCategory view filter');
    }

    const requestBody = configureRequestBody(
        baseFolderId,
        paging,
        viewFilter,
        sortResults,
        focusedViewFilter,
        findItemShapeName,
        categoryName,
        traversal,
        searchFolderId,
        itemResponseShape
    );

    return findItemOperation(
        {
            Header: getJsonRequestHeader(),
            Body: requestBody,
        },
        options
    ).then(response => {
        return response.Body.ResponseMessages.Items[0];
    });
}
