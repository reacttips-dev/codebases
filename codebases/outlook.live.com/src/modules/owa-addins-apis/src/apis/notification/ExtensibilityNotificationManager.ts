import type {
    default as ExtensibilityNotification,
    NotificationMessageWithCustomBar,
} from './ExtensibilityNotification';

export const MAX_NOTIFICATION_MESSAGES_PER_APP = 5;

export let extensibilityNotifications: {
    [hostItemIndex: string]: {
        data: ExtNotificationMapByExtensionId;
        messageIds: string[];
    };
} = {};

export interface ExtNotificationMapByExtensionId {
    [extensionId: string]: ExtNotificationMap;
}

export interface ExtNotificationMap {
    [messageId: string]: ExtensibilityNotification;
}

// this map is for looking up the hostItemIndex and extensionId
// associated with the messageId
export let metaLookup: {
    [messageId: string]: ExtNotificationMeta;
} = {};

export interface ExtNotificationMeta {
    hostItemIndex: string;
    extensionId: string;
}

export function addOrReplaceExtensibilityNotification(
    hostItemIndex: string,
    extensionId: string,
    messageId: string,
    notification: ExtensibilityNotification
): void {
    if (!getValueAtPath([hostItemIndex, 'data', extensionId])) {
        initializeMaps(hostItemIndex, extensionId);
    }

    if (hasExtensibilityNotification(messageId)) {
        removeFromMap(messageId);
    }

    addToMap(hostItemIndex, extensionId, messageId, notification);
}

export function removeExtensibilityNotification(messageId: string): void {
    const currentNotification = getExtensibilityNotification(messageId);
    if (!currentNotification) {
        return;
    }

    removeFromMap(messageId);
}

export function getExtensibilityNotification(messageId: string): ExtensibilityNotification {
    if (!hasExtensibilityNotification(messageId)) {
        return null;
    }

    const { hostItemIndex, extensionId } = metaLookup[messageId];
    return getValueAtPath([
        hostItemIndex,
        'data',
        extensionId,
        messageId,
    ]) as ExtensibilityNotification;
}

export function hasExtensibilityNotification(messageId: string): boolean {
    return !!metaLookup[messageId];
}

export function isExtensibilityNotificationLimitExceeded(
    hostItemIndex: string,
    extensionId: string,
    actions: NotificationMessageWithCustomBar
): boolean {
    const extNotificationMap = getExtNotificationMap(hostItemIndex, extensionId) || [];
    const numOfNotifications = Object.keys(extNotificationMap).length || 0;
    return actions
        ? numOfNotifications >= 1
        : numOfNotifications >= MAX_NOTIFICATION_MESSAGES_PER_APP;
}

export function getAllPersistentNotifications(
    hostItemIndex: string,
    extensionId: string
): ExtNotificationMap {
    const extNotificationMap = getExtNotificationMap(hostItemIndex, extensionId);
    if (!extNotificationMap) {
        return {};
    }

    return Object.keys(extNotificationMap).reduce((result, messageId) => {
        const notification: ExtensibilityNotification = extNotificationMap[messageId];
        if (notification.Persistent) {
            result[messageId] = notification;
        }
        return result;
    }, <ExtNotificationMap>{});
}

export function getAllMessageIds(hostItemIndex: string): string[] {
    return extensibilityNotifications[hostItemIndex]
        ? extensibilityNotifications[hostItemIndex].messageIds
        : [];
}

export function destroyExtensibilityNotifications(hostItemIndex: string): void {
    if (!extensibilityNotifications[hostItemIndex]) {
        return;
    }

    const messageIds = extensibilityNotifications[hostItemIndex].messageIds;
    messageIds.forEach(messageId => delete metaLookup[messageId]);

    delete extensibilityNotifications[hostItemIndex];
}

// currently used for tests only
export function clearExtensibilityNotifications() {
    extensibilityNotifications = {};
    metaLookup = {};
}

function initializeMaps(hostItemIndex: string, extensionId: string): void {
    extensibilityNotifications[hostItemIndex] = extensibilityNotifications[hostItemIndex] || {
        data: {},
        messageIds: [],
    };
    extensibilityNotifications[hostItemIndex].data[extensionId] = {};
}

function addToMap(
    hostItemIndex: string,
    extensionId: string,
    messageId: string,
    notification: ExtensibilityNotification
): void {
    extensibilityNotifications[hostItemIndex].data[extensionId][messageId] = notification;
    extensibilityNotifications[hostItemIndex].messageIds.push(messageId);
    metaLookup[messageId] = { hostItemIndex, extensionId };
}

function removeFromMap(messageId: string): void {
    const { hostItemIndex, extensionId } = metaLookup[messageId];
    const extNotificationMap = getExtNotificationMap(hostItemIndex, extensionId);
    delete extNotificationMap[messageId];
    delete metaLookup[messageId];

    const messageIds = extensibilityNotifications[hostItemIndex].messageIds;
    const index = messageIds.indexOf(messageId);
    if (~index) {
        messageIds.splice(index, 1);
    }
}

function getExtNotificationMap(hostItemIndex: string, extensionId: string): ExtNotificationMap {
    return getValueAtPath([hostItemIndex, 'data', extensionId]) as ExtNotificationMap;
}

function getValueAtPath(keyPath: string[]): any {
    let obj: any = extensibilityNotifications;
    for (let i = 0; i < keyPath.length; i++) {
        const key = keyPath[i];
        if (!obj[key]) {
            return null;
        }
        obj = obj[key];
    }
    return obj;
}
