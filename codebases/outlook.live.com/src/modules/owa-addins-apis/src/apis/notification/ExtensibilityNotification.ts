import type Notification from 'owa-service/lib/contract/Notification';
import WebExtNotificationTypeType from 'owa-service/lib/contract/WebExtNotificationTypeType';
import type { IAddinCommand } from 'owa-addins-store';

export interface ExtensibilityNotification extends Notification {
    ExtensionId?: string;
    Persistent?: boolean;
    Actions?: NotificationMessageWithCustomBar;
}

export interface InforBarActionArgs {
    actionType: string;
    actionText: string;
    commandId: string;
    contextData: object;
}

export interface NotificationMessageWithCustomBar {
    NotificationActionData: InforBarActionArgs;
    CustomButtonAction: IAddinCommand;
    CustomButtonIcon?: string;
}

export interface NotificationMessageArgs {
    icon: string;
    key: string;
    message: string;
    persistent: boolean;
    type: WebExtNotificationTypeType;
    actions?: InforBarActionArgs[];
}

export interface NotificationMessageResponse {
    icon: string;
    key: string;
    message: string;
    persistent: boolean;
    type: string;
    actions?: InforBarActionArgs;
}

export function createExtensibilityNotification(
    extensionId: string,
    persistent: boolean,
    key: string,
    type: WebExtNotificationTypeType,
    message: string,
    icon: string,
    actions: NotificationMessageWithCustomBar
): ExtensibilityNotification {
    return {
        ExtensionId: extensionId,
        Persistent: !!persistent || type === WebExtNotificationTypeType.ErrorMessage,
        Key: key,
        Type: type,
        Message: message,
        Icon: icon,
        Actions: actions || null,
    };
}

export function createNotificationMessageResponse(
    notification: ExtensibilityNotification
): NotificationMessageResponse {
    const response: NotificationMessageResponse = {
        key: notification.Key,
        type: getNotificationOutputType(notification.Type),
        message: notification.Message,
        icon: notification.Icon,
        ...(notification.Persistent &&
            notification.Type !== WebExtNotificationTypeType.ErrorMessage && { persistent: true }),
    };

    return response;
}

function getNotificationOutputType(type: WebExtNotificationTypeType): string {
    switch (type) {
        case WebExtNotificationTypeType.InformationalMessage:
            return 'informationalMessage';
        case WebExtNotificationTypeType.ErrorMessage:
            return 'errorMessage';
        case WebExtNotificationTypeType.ProgressIndicator:
            return 'progressIndicator';
        case WebExtNotificationTypeType.InsightMessage:
            return 'insightMessage';
    }

    return '';
}

export default ExtensibilityNotification;
