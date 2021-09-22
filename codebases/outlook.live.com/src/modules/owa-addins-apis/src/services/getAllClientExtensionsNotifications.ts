import type GetAllClientExtensionsNotificationsJsonResponse from 'owa-service/lib/contract/GetAllClientExtensionsNotificationsJsonResponse';
import getAllClientExtensionsNotificationsOperation from 'owa-service/lib/operation/getAllClientExtensionsNotificationsOperation';
import getAllClientExtensionsNotificationsRequest from 'owa-service/lib/factory/getAllClientExtensionsNotificationsRequest';
import type ItemId from 'owa-service/lib/contract/ItemId';
import { getJsonRequestHeader } from 'owa-service/lib/ServiceRequestUtils';

export default function getAllClientExtensionsNotifications(
    itemId: ItemId
): Promise<GetAllClientExtensionsNotificationsJsonResponse> {
    const request = getAllClientExtensionsNotificationsRequest({
        ItemId: itemId,
    });

    return getAllClientExtensionsNotificationsOperation({
        Header: getJsonRequestHeader(),
        Body: request,
    });
}
