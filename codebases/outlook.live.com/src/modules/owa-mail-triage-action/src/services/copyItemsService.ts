import getServiceItemIds from './utils/getServiceItemIds';
import type CopyItemJsonResponse from 'owa-service/lib/contract/CopyItemJsonResponse';
import type CopyItemRequest from 'owa-service/lib/contract/CopyItemRequest';
import type CopyItemResponse from 'owa-service/lib/contract/CopyItemResponse';
import copyItemRequest from 'owa-service/lib/factory/copyItemRequest';
import copyItemOperation from 'owa-service/lib/operation/copyItemOperation';
import { getJsonRequestHeader } from 'owa-service/lib/ServiceRequestUtils';
import type TargetFolderId from 'owa-service/lib/contract/TargetFolderId';
import type RequestOptions from 'owa-service/lib/RequestOptions';

/**
 * The service command to copy items to a specified destination folder
 * @param itemIds the ids of the items to be copied
 * @param destinationFolderId the id of destination folder to copy to
 * @return a Promise which contains the CopyItemResponse
 */
export default function copyItemsService(
    itemIds: string[],
    toFolderId: TargetFolderId,
    remoteExecute: boolean,
    requestOptions?: RequestOptions
): Promise<CopyItemResponse> {
    const requestBody = configureRequestBody(itemIds, toFolderId, remoteExecute);

    return copyItemOperation(
        {
            Header: getJsonRequestHeader(),
            Body: requestBody,
        },
        requestOptions
    ).then((response: CopyItemJsonResponse) => {
        return response.Body;
    });
}

/**
 * Configure the CopyItemRequest body
 * @param itemIds the ids of the items to be copied
 * @param destinationTableQuery the table query of the destination Folder or Group to copy to
 * @return the CopyItemRequest body
 */
function configureRequestBody(
    itemIds: string[],
    toFolderId: TargetFolderId,
    remoteExecute: boolean
): CopyItemRequest {
    return copyItemRequest({
        ToFolderId: toFolderId,
        ItemIds: getServiceItemIds(itemIds),
        ReturnNewItemIds: true,
        RemoteExecute: remoteExecute,
    });
}
