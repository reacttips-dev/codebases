import generateMessageId from './generateMessageId';
import { removeAutomaticProgressNotificationMessage } from './removeNotificationMessage';
import updatePersistentNotifications from './updatePersistentNotifications';
import { Adapter, getAdapter } from 'owa-addins-adapters';
import ApiError from '../ApiError';
import ApiErrorCode from '../ApiErrorCode';
import type { ApiMethodResponse } from '../ApiMethod';
import { createErrorResult, createSuccessResult } from '../ApiMethodResponseCreator';
import { userCanEditItem } from '../sharedProperties/itemPermissions';
import { getExtensionId } from 'owa-addins-store';
import type WebExtNotificationTypeType from 'owa-service/lib/contract/WebExtNotificationTypeType';
import {
    addOrReplaceExtensibilityNotification,
    getExtensibilityNotification,
    hasExtensibilityNotification,
    isExtensibilityNotificationLimitExceeded,
} from './ExtensibilityNotificationManager';
import {
    ExtensibilityNotification,
    createExtensibilityNotification,
    NotificationMessageWithCustomBar,
} from './ExtensibilityNotification';

export default async function addOrReplaceNotificationMessage(
    hostItemIndex: string,
    controlId: string,
    persistent: boolean,
    key: string,
    type: WebExtNotificationTypeType,
    message: string,
    icon: string = null,
    noDupes: boolean = false,
    actions: NotificationMessageWithCustomBar = null
): Promise<ApiMethodResponse> {
    const adapter: Adapter = getAdapter(hostItemIndex);
    if (!adapter) {
        return createErrorResult(ApiErrorCode.InvalidSelection);
    }
    const extensionId = getExtensionId(controlId);
    const messageId = generateMessageId(hostItemIndex, extensionId, key);

    removeAutomaticProgressNotificationMessage(hostItemIndex, controlId, extensionId);

    let isCurrentNotificationPersistent: boolean = false;

    if (hasExtensibilityNotification(messageId)) {
        if (noDupes) {
            return createErrorResult(ApiErrorCode.DuplicateNotificationKey);
        }
        const currentNotification: ExtensibilityNotification = getExtensibilityNotification(
            messageId
        );
        isCurrentNotificationPersistent = currentNotification.Persistent;
    } else if (isExtensibilityNotificationLimitExceeded(hostItemIndex, extensionId, actions)) {
        return createErrorResult(ApiErrorCode.NumberOfNotificationsExceeded);
    }

    const newNotification = createExtensibilityNotification(
        extensionId,
        persistent,
        key,
        type,
        message,
        icon,
        actions
    );

    // If the user has read-only access, return an item permissions error for persistent and error notifications
    const canPersist = userCanEditItem(adapter);

    // This reads the value from the created notification so the Error notification type is handled correctly
    if (!canPersist && newNotification.Persistent) {
        return createErrorResult(ApiErrorCode.InsufficientItemPermissions);
    }

    addOrReplaceExtensibilityNotification(hostItemIndex, extensionId, messageId, newNotification);

    adapter.addNotificationMessage(messageId);

    try {
        if (isCurrentNotificationPersistent || newNotification.Persistent) {
            await updatePersistentNotifications(hostItemIndex, extensionId);
        }
    } catch (error) {
        if (error instanceof ApiError) {
            return createErrorResult(error.errorCode);
        }
    }

    return createSuccessResult();
}
