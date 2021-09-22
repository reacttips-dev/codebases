import type ExtensibilityNotification from './ExtensibilityNotification';
import generateMessageId from './generateMessageId';
import getAllClientExtensionsNotifications from '../../services/getAllClientExtensionsNotifications';
import type GetAllClientExtensionsNotificationsJsonResponse from 'owa-service/lib/contract/GetAllClientExtensionsNotificationsJsonResponse';
import type ItemId from 'owa-service/lib/contract/ItemId';
import updatePersistentNotifications from './updatePersistentNotifications';
import WebExtNotificationTypeType from 'owa-service/lib/contract/WebExtNotificationTypeType';
import { Adapter, getAdapter } from 'owa-addins-adapters';
import {
    addOrReplaceExtensibilityNotification,
    getAllMessageIds,
} from './ExtensibilityNotificationManager';

export default async function initializeExtensibilityNotifications(
    hostItemIndex: string
): Promise<void> {
    const adapter: Adapter = getAdapter(hostItemIndex);
    const itemId: ItemId = { Id: await adapter.getItemId() };

    if (!adapter.addNotificationMessage) {
        return;
    }

    // adds notifications created from UIless add-ins of unactive host items
    const activeMessageIds = getAllMessageIds(hostItemIndex);
    activeMessageIds.map(adapter.addNotificationMessage);

    const response: GetAllClientExtensionsNotificationsJsonResponse = await getAllClientExtensionsNotifications(
        itemId
    ).catch(onServiceError);

    if (response) {
        const apps = response.Body.Apps || [];
        apps.forEach(app => {
            let needsUpdateToServer: boolean = false;
            app.Notifications.forEach(notification => {
                const extNotification: ExtensibilityNotification = {
                    ExtensionId: app.Id,
                    Persistent: true,
                    Key: notification.Key,
                    Type: notification.Type,
                    Message: notification.Message,
                    Icon: notification.Icon,
                };

                if (notification.Type === WebExtNotificationTypeType.ErrorMessage) {
                    extNotification.Persistent = false;
                    needsUpdateToServer = true;
                }

                const messageId = generateMessageId(hostItemIndex, app.Id, notification.Key);
                addOrReplaceExtensibilityNotification(
                    hostItemIndex,
                    app.Id,
                    messageId,
                    extNotification
                );
                adapter.addNotificationMessage(messageId);
            });

            if (needsUpdateToServer) {
                updatePersistentNotifications(hostItemIndex, app.Id);
            }
        });
    }
}

function onServiceError(): GetAllClientExtensionsNotificationsJsonResponse {
    // For debugging - ApiErrorCode.PersistedNotificationArrayReadError
    // This is called before add-in is initalized
    return null;
}
