import generateMessageId from './generateMessageId';
import updatePersistentNotifications from './updatePersistentNotifications';
import { Adapter, getAdapter } from 'owa-addins-adapters';
import ApiError from '../ApiError';
import ApiErrorCode from '../ApiErrorCode';
import type { ApiMethodResponse } from '../ApiMethod';
import { createErrorResult, createSuccessResult } from '../ApiMethodResponseCreator';
import { userCanEditItem } from '../sharedProperties/itemPermissions';
import { getAddinCommandForControl, getExtensionId, IAddinCommand } from 'owa-addins-store';
import {
    hasExtensibilityNotification,
    getExtensibilityNotification,
    removeExtensibilityNotification,
} from './ExtensibilityNotificationManager';

export default async function removeNotificationMessage(
    hostItemIndex: string,
    controlId: string,
    key: string
): Promise<ApiMethodResponse> {
    const adapter: Adapter = getAdapter(hostItemIndex);

    const extensionId = getExtensionId(controlId);
    const messageId = generateMessageId(hostItemIndex, extensionId, key);

    if (!hasExtensibilityNotification(messageId)) {
        return createErrorResult(ApiErrorCode.NotificationKeyNotFound);
    }

    const extNotification = getExtensibilityNotification(messageId);
    const isPersistent = extNotification.Persistent;

    // Check permissions before removing a persistent notification
    if (isPersistent && !userCanEditItem(adapter)) {
        return createErrorResult(ApiErrorCode.InsufficientItemPermissions);
    }

    adapter.removeNotificationMessage(messageId);

    removeExtensibilityNotification(messageId);

    try {
        if (isPersistent) {
            await updatePersistentNotifications(hostItemIndex, extensionId);
        }
    } catch (error) {
        if (error instanceof ApiError) {
            return createErrorResult(error.errorCode);
        }
    }

    return createSuccessResult();
}

export function removeAutomaticProgressNotificationMessage(
    hostItemIndex: string,
    controlId: string,
    extensionId: string
): void {
    const addinCommand: IAddinCommand = getAddinCommandForControl(controlId);
    if (!addinCommand) {
        return;
    }

    const key = addinCommand.get_Id();
    const messageId = generateMessageId(hostItemIndex, extensionId, key);
    if (hasExtensibilityNotification(messageId)) {
        removeNotificationMessage(hostItemIndex, controlId, key);
    }
}
