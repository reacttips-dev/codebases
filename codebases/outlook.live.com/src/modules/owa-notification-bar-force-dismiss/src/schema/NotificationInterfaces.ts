import type { NotificationBarCallbackReason as DefaultNotificationBarCallbackReason } from 'owa-notification-bar';
import type { HotkeyCommand, Hotkeys } from 'owa-hotkeys';

/**
 * The options for the notification bar itself
 */
export interface NotificationOptions {
    icon?: string;
    minWidth?: number;
    maxWidth?: number;
    shouldShowDismissIcon?: boolean;
    shouldShowSpinner?: boolean;
    allowAutoDismiss?: boolean;
    isHovered?: boolean;
    autoDismissInSeconds?: number;
    primaryActionHotKeyCommand?: HotkeyCommand | Hotkeys | DefaultHotKeyCommand;
}

export enum DefaultHotKeyCommand {
    Retry = 1,
    Undo = 2,
}

/**
 * The custom notification callback reasons
 */
export enum CustomNotificationBarCallbackReason {
    // starting from 11 in case additional callback reasons get added to original NotificationBarCallbackReason enum
    ForceDismissedFromCode = 11,
}

/**
 * The union type for callback reasons for notifications
 */
export type NotificationBarCallbackReason =
    | CustomNotificationBarCallbackReason
    | DefaultNotificationBarCallbackReason;

/**
 * The options for the action button in the notification bar, if any
 */
export interface NotificationButtonOptions {
    primaryActionText: string;
    callbackOptions?: NotificationCallbackOptions;
    notificationCallback?: (reason: NotificationBarCallbackReason) => void;
}

/**
 * The callback functions for the notification bar button
 */
export interface NotificationCallbackOptions {
    primaryActionClickedCallback: () => void;
    dismissedCallback?: () => void;
}
