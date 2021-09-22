import type BasePagingType from 'owa-service/lib/contract/BasePagingType';
import type FileProviderServiceResponse from '../../types/FileProviderServiceResponse';
import type FindItemJsonResponse from 'owa-service/lib/contract/FindItemJsonResponse';
import findItemOperation from 'owa-service/lib/operation/findItemOperation';
import findItemRequest from 'owa-service/lib/factory/findItemRequest';
import type FindItemRequest from 'owa-service/lib/contract/FindItemRequest';
import type FindItemResponseMessage from 'owa-service/lib/contract/FindItemResponseMessage';
import folderId from 'owa-service/lib/factory/folderId';
import folderNameToId from 'owa-session-store/lib/utils/folderNameToId';
import indexedPageView from 'owa-service/lib/factory/indexedPageView';
import itemResponseShape from 'owa-service/lib/factory/itemResponseShape';
import type Message from 'owa-service/lib/contract/Message';
import { getJsonRequestHeader } from 'owa-service/lib/ServiceRequestUtils';
import { trace } from 'owa-trace';

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
        ShapeName: 'MailListItem',
        Traversal: 'Shallow',
        Paging: paging,
        FocusedViewFilter: -1,
        ViewFilter: 'All',
        SortOrder: null,
    });
}

/**
 * Find item request
 * @param currentBaseFolderId the current base folder id
 * @param paging the paging type
 * @return promise containing FindItem response
 */
function findMailMessageItemService(
    curentFolderId: string,
    paging: BasePagingType
): Promise<FindItemJsonResponse> {
    const requestBody = configureRequestBody(curentFolderId, paging);

    return findItemOperation({
        Header: getJsonRequestHeader(),
        Body: requestBody,
    });
}

export default async function getMailMessageItems(
    folderId: string,
    offset: number
): Promise<FileProviderServiceResponse<Message[]>> {
    const paging = indexedPageView({
        BasePoint: 'Beginning',
        Offset: offset,
        MaxEntriesReturned: 100,
    });

    //set folderId to inbox folder id if not specified
    folderId = folderId || folderNameToId('inbox');

    const findItemResponse: FindItemJsonResponse = await findMailMessageItemService(
        folderId,
        paging
    );
    const responseMessage: FindItemResponseMessage =
        findItemResponse.Body.ResponseMessages.Items[0];

    if (
        responseMessage &&
        responseMessage.ResponseClass === 'Success' &&
        responseMessage.RootFolder.Items
    ) {
        return { errorResponse: null, result: responseMessage.RootFolder.Items };
    } else {
        // VSO #33289 Figure out correct logging response for mail messages
        trace.warn(`Find Item Response of get mail messages failed with ${responseMessage}`);
        const response: Response = {
            body: null,
            headers: null,
            ok: false,
            redirected: false,
            status: 1, //Generic failure
            statusText: 'Get mail message items error',
            type: null,
            url: null,
            clone: null,
            bodyUsed: null,
            arrayBuffer: null,
            blob: null,
            formData: null,
            json: null,
            text: null,
            trailer: null,
        };

        return { errorResponse: response, result: null };
    }
}
