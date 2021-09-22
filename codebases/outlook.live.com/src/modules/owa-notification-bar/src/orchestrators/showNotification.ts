import type { NotificationBarCallbackReason } from '../callbacksMap/NotificationBarCallbackReason';
import { setNotificationBarCallback } from '../callbacksMap/notificationBarCallbacks';
import pushNotification from '../mutators/pushNotification';
import dismissNotification, { startAutoDismissTimer } from '../orchestrators/dismissNotification';
import type NotificationBarData from '../store/schema/NotificationBarData';
import type NotificationBarHostId from '../store/schema/NotificationBarHostId';
import type NotificationBarStore from '../store/schema/NotificationBarStore';
import store from '../store/Store';
import * as trace from 'owa-trace';
import {
    getIsBitSet,
    AccessibilityBitFlagsMasks,
} from 'owa-bit-flags/lib/utils/accessibilityBitFlagsUtil';
import type { HotkeyCommand, Hotkeys } from 'owa-hotkeys';

const DEFAULT_AUTO_DISMISS_TIME_IN_SECONDS = 7;
const DEFAULT_CONTAINER_WIDTH = 400;

export interface ShowNotificationState {
    store: NotificationBarStore;
}

export interface NotificationBarOptions {
    icon?: string;
    primaryActionText?: string;
    secondaryActionText?: string;
    minWidth?: number;
    maxWidth?: number;
    shouldShowDismissIcon?: boolean;
    shouldShowSpinner?: boolean;
    allowAutoDismiss?: boolean;
    isHovered?: boolean;
    autoDismissInSeconds?: number;
    allowClear?: boolean;
    notificationCallback?: (reason: NotificationBarCallbackReason) => void;
    primaryActionHotKeyCommand?: HotkeyCommand | Hotkeys;
    primaryActionIcon?: string;
    showButtonsOnBottom?: boolean;
}

/**
 * shows the given notification
 * @param id of the notification to be show
 * @param hostId ID of the NotificationBarHost that will show the notification.
 * @param contentText to show on the notification
 * @param icon to show on the notification, optional
 * @param iconColor for displaying the icon, optional
 * @param primaryActionText for showing the primary action
 * @param secondaryActionText for showing the secondary action
 * @param shouldShowDismissicon determines whether to show the "X" dismiss icon, default is true
 * @param shouldShowSpinner determines whether a spinner would be show in place of the icon, default is false
 * @param allowAutoDismiss determines whether the notification will be auto dismissed, default is true
 * @param autoDismissInSeconds defines the number of seconds to display a notification before it's auto dismissed,
 * default is 5 seconds
 * @param notificationCallback callback to be executed when the action is performed on the notification bar
 * @param state for unit test
 */
export default function showNotification(
    id: string,
    hostId: NotificationBarHostId,
    contentText?: string | (() => string),
    {
        icon,
        primaryActionText,
        secondaryActionText,
        minWidth = DEFAULT_CONTAINER_WIDTH,
        maxWidth = DEFAULT_CONTAINER_WIDTH,
        shouldShowSpinner = false,
        allowAutoDismiss = true,
        autoDismissInSeconds = DEFAULT_AUTO_DISMISS_TIME_IN_SECONDS,
        allowClear = false,
        isHovered = false,
        notificationCallback,
        primaryActionHotKeyCommand,
        primaryActionIcon = null,
        showButtonsOnBottom = false,
    }: NotificationBarOptions = {},
    renderContent?: () => JSX.Element,
    state: ShowNotificationState = { store: store }
) {
    contentText = typeof contentText === 'function' ? contentText() : contentText;
    if (!contentText && !renderContent) {
        trace.errorThatWillCauseAlert(
            'contentText or renderContent is required to show the notification'
        );
        return;
    }
    if ((primaryActionText || secondaryActionText) && !notificationCallback) {
        trace.errorThatWillCauseAlert(
            'notification callback must be defined with a primary or secondary action'
        );
        return;
    }
    const notification: NotificationBarData = {
        id: id,
        contentText: contentText,
        hostId: hostId,
        icon: icon,
        primaryActionText: primaryActionText,
        secondaryActionText: secondaryActionText,
        minWidth: minWidth,
        maxWidth: maxWidth,
        shouldShowSpinner: shouldShowSpinner,
        allowAutoDismiss: allowAutoDismiss,
        autoDismissInSeconds: autoDismissInSeconds,
        allowClear: allowClear,
        primaryActionHotKeyCommand: primaryActionHotKeyCommand,
        renderContent: renderContent,
        primaryActionIcon: primaryActionIcon,
        showButtonsOnBottom: showButtonsOnBottom,
    };
    if (state.store.notificationStack.length > 0) {
        // dismiss the notification that's currently showing if it allows for auto-dismiss
        const idCurrentlyShown =
            state.store.notificationStack[state.store.notificationStack.length - 1];
        const notificationCurrentlyShown = state.store.notificationsMap.get(idCurrentlyShown);
        if (notificationCurrentlyShown.allowAutoDismiss) {
            dismissNotification(idCurrentlyShown);
        }
    }
    setNotificationBarCallback(id, notificationCallback);
    pushNotification(id, notification);
    if (
        allowAutoDismiss &&
        !getIsBitSet(AccessibilityBitFlagsMasks.ShouldNotDismissLatestNotification)
    ) {
        startAutoDismissTimer(id, autoDismissInSeconds);
    }
}
