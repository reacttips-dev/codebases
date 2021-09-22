import type ItemId from 'owa-service/lib/contract/ItemId';
import type Notification from 'owa-service/lib/contract/Notification';
import type UpdateClientExtensionNotificationsJsonResponse from 'owa-service/lib/contract/UpdateClientExtensionNotificationsJsonResponse';
import updateClientExtensionNotificationsOperation from 'owa-service/lib/operation/updateClientExtensionNotificationsOperation';
import updateClientExtensionNotificationsRequest from 'owa-service/lib/factory/updateClientExtensionNotificationsRequest';
import { getJsonRequestHeader } from 'owa-service/lib/ServiceRequestUtils';

export default function updateClientExtensionNotifications(
    extensionId: string,
    itemId: ItemId,
    notifications: Notification[]
): Promise<UpdateClientExtensionNotificationsJsonResponse> {
    const request = updateClientExtensionNotificationsRequest({
        ItemId: itemId,
        Id: extensionId,
        Notifications: notifications,
    });

    return updateClientExtensionNotificationsOperation({
        Header: getJsonRequestHeader(),
        Body: request,
    });
}
