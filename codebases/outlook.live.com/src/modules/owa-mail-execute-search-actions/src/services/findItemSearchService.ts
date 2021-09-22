import type BasePagingType from 'owa-service/lib/contract/BasePagingType';
import type FindItemRequest from 'owa-service/lib/contract/FindItemRequest';
import type FindItemResponseMessage from 'owa-service/lib/contract/FindItemResponseMessage';
import type FocusedViewFilter from 'owa-service/lib/contract/FocusedViewFilter';
import type SortResults from 'owa-service/lib/contract/SortResults';
import type ViewFilter from 'owa-service/lib/contract/ViewFilter';
import findItemRequest from 'owa-service/lib/factory/findItemRequest';
import findItemOperation from 'owa-service/lib/operation/findItemOperation';
import { getJsonRequestHeader } from 'owa-service/lib/ServiceRequestUtils';
import type ItemQueryTraversal from 'owa-service/lib/contract/ItemQueryTraversal';
import itemResponseShape from 'owa-service/lib/factory/itemResponseShape';
import queryStringType from 'owa-service/lib/factory/queryStringType';
import type QueryStringType from 'owa-service/lib/contract/QueryStringType';
import folderId from 'owa-service/lib/factory/folderId';
import type RestrictionType from 'owa-service/lib/contract/RestrictionType';
import type RequestOptions from 'owa-service/lib/RequestOptions';
import { getGuid } from 'owa-guid';

/**
 * Configure the request body
 * @param currentFolderId the current folder id
 * @param queryStringData the query string object
 * @param paging the paging type
 * @param viewFilter the view filter
 * @param sortResults the primary and secondary sort by results
 * @param focusedViewFilter the focused view filter
 * @param traversal the traversal to use for this find request
 * @param refinerRestriction search refiner restrictions
 * @return FindItem request
 */
function configureRequestBody(
    curentFolderId: string,
    queryStringData: QueryStringType,
    paging: BasePagingType,
    viewFilter: ViewFilter,
    sortResults: SortResults[],
    focusedViewFilter: FocusedViewFilter,
    traversal: ItemQueryTraversal,
    refinerRestriction: RestrictionType
): FindItemRequest {
    return findItemRequest({
        ParentFolderIds: [folderId({ Id: curentFolderId })],
        ItemShape: itemResponseShape({ BaseShape: 'IdOnly' }),
        ShapeName: 'MailListItem',
        Traversal: traversal,
        Paging: paging,
        FocusedViewFilter: focusedViewFilter,
        ViewFilter: viewFilter,
        SortOrder: sortResults,
        IsWarmUpSearch: false,
        QueryString: queryStringType(queryStringData),
        RefinerRestriction: refinerRestriction,
        SearchFolderIdentity: getGuid(),
    });
}

/**
 * Find item request
 * @param curentFolderId the current folder id
 * @param queryStringData the query string object
 * @param paging the paging type
 * @param viewFilter the view filter
 * @param sortResults the primary and secondary sort by results
 * @param focusedViewFilter the focused view filter
 * @param options - optional parameters to be passed to request (method and/or headers)
 * @param traversal the traversal to use for this find request
 * @param refinerRestriction search refiner restrictions
 * @return promise containing FindItem response
 */
export default function findItemSearchService(
    curentFolderId: string,
    queryStringData: QueryStringType,
    paging: BasePagingType,
    viewFilter: ViewFilter,
    sortResults: SortResults[],
    focusedViewFilter: FocusedViewFilter,
    options: RequestOptions,
    traversal: ItemQueryTraversal,
    refinerRestriction: RestrictionType
): Promise<FindItemResponseMessage> {
    const requestBody = configureRequestBody(
        curentFolderId,
        queryStringData,
        paging,
        viewFilter,
        sortResults,
        focusedViewFilter,
        traversal,
        refinerRestriction
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
