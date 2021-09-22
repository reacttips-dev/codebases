import type BasePagingType from 'owa-service/lib/contract/BasePagingType';
import type FindItemJsonResponse from 'owa-service/lib/contract/FindItemJsonResponse';
import findItemOperation from 'owa-service/lib/operation/findItemOperation';
import findItemRequest from 'owa-service/lib/factory/findItemRequest';
import type FindItemRequest from 'owa-service/lib/contract/FindItemRequest';
import folderId from 'owa-service/lib/factory/folderId';
import type IndexedPageView from 'owa-service/lib/contract/IndexedPageView';
import itemResponseShape from 'owa-service/lib/factory/itemResponseShape';
import propertyUri from 'owa-service/lib/factory/propertyUri';
import type SortResults from 'owa-service/lib/contract/SortResults';
import sortResults from 'owa-service/lib/factory/sortResults';
import { getJsonRequestHeader } from 'owa-service/lib/ServiceRequestUtils';

/**
 * Configure the request body
 * @param curentFolderId the current folder id
 * @param paging the paging type
 * @return FindItem request
 */
function configureRequestBody(curentFolderId: string, paging: BasePagingType): FindItemRequest {
    return findItemRequest({
        ParentFolderIds: [folderId({ Id: curentFolderId })],
        ItemShape: itemResponseShape({ BaseShape: 'IdOnly' }),
        ShapeName: 'BulkActionItem',
        Traversal: 'Shallow',
        Paging: paging,
        FocusedViewFilter: -1,
        ViewFilter: 'All',
        SortOrder: getBulkActionItemSortOrder(),
    });
}

function getBulkActionItemSortOrder(): SortResults[] {
    return [
        sortResults({
            Order: 'Descending',
            Path: propertyUri({
                FieldURI: 'ItemLastModifiedTime',
            }),
        }),
    ];
}

export default function findBulkActionItemService(
    startIndex: number,
    rowsToLoad: number,
    paging: IndexedPageView,
    bulkActionId: string
): Promise<FindItemJsonResponse> {
    const requestBody = configureRequestBody(bulkActionId, paging);
    const requestHeader = getJsonRequestHeader();
    requestHeader.RequestServerVersion = 'V2018_01_18';

    return findItemOperation({
        Header: requestHeader,
        Body: requestBody,
    });
}
