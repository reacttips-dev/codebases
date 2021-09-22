import ApiError from '../ApiError';
import ApiErrorCode from '../ApiErrorCode';
import type ItemId from 'owa-service/lib/contract/ItemId';
import type Notification from 'owa-service/lib/contract/Notification';
import updateClientExtensionNotifications from '../../services/updateClientExtensionNotifications';
import { Adapter, getAdapter } from 'owa-addins-adapters';
import type { ExtensibilityNotification } from './ExtensibilityNotification';
import {
    ExtNotificationMap,
    getAllPersistentNotifications,
} from './ExtensibilityNotificationManager';

export default async function updatePersistentNotifications(
    hostItemIndex: string,
    extensionId: string
): Promise<void> {
    const adapter: Adapter = getAdapter(hostItemIndex);
    const itemId: ItemId = { Id: await adapter.getItemId() };
    if (!itemId.Id) {
        // item should be saved first before persisting notifications
        throw new ApiError(ApiErrorCode.CannotPersistPropertyInUnsavedDraftError);
    }

    const persistentNotifications: ExtNotificationMap = getAllPersistentNotifications(
        hostItemIndex,
        extensionId
    );
    const notifications: Notification[] = Object.keys(persistentNotifications).map(messageId => {
        const extNotification: ExtensibilityNotification = persistentNotifications[messageId];
        return <Notification>{
            Key: extNotification.Key,
            Type: extNotification.Type,
            Message: extNotification.Message,
            Icon: extNotification.Icon,
        };
    });

    await updateClientExtensionNotifications(extensionId, itemId, notifications).catch(error => {
        throw new ApiError(ApiErrorCode.PersistedNotificationArraySaveError);
    });
}
