import { Adapter, getAdapter } from 'owa-addins-adapters';
import type { ApiMethodCallback } from '../ApiMethod';
import { createSuccessResult } from '../ApiMethodResponseCreator';
import { getExtensibilityNotification } from './ExtensibilityNotificationManager';
import {
    createNotificationMessageResponse,
    NotificationMessageResponse,
} from './ExtensibilityNotification';

export default function getAllNotificationMessagesAsyncApiMethod(
    hostItemIndex: string,
    controlId: string,
    data: null,
    callback: ApiMethodCallback
) {
    const adapter: Adapter = getAdapter(hostItemIndex);
    const messageIds: string[] = adapter.getNotificationMessageIds();

    const notificationResponses: NotificationMessageResponse[] = messageIds.reduce(
        (result, messageId) => {
            const notification = getExtensibilityNotification(messageId);
            if (notification) {
                result.push(createNotificationMessageResponse(notification));
            }
            return result;
        },
        <NotificationMessageResponse[]>[]
    );

    callback(createSuccessResult(notificationResponses));
}
