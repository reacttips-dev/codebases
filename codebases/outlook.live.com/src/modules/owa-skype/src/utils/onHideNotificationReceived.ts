import type { SkypeNotification } from '../store/schema/swcTypes';
import { NotificationActionType, removeNotification } from 'owa-header-toast-notification';
import store from 'owa-header-toast-notification/lib/store/store';

export default function onHideNotificationReceived(notificationIdToHide: string): void {
    store.notificationViewStates.forEach(notificationViewState => {
        if (notificationViewState.actionType == NotificationActionType.SkypeNotification) {
            if (
                (notificationViewState.actionContext as SkypeNotification).id ==
                notificationIdToHide
            ) {
                removeNotification(notificationViewState);
                return;
            }
        }
    });
}
