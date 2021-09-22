import type NewMailNotificationPayload from 'owa-service/lib/contract/NewMailNotificationPayload';
import onLikeNotificationClicked from '../actions/onLikeNotificationClicked';
import onNewMailNotificationClicked from '../actions/onNewMailNotificationClicked';
import onNewMailOSNotificationClicked from '../actions/onNewMailOSNotificationClicked';
import removeLikeNotification from '../mutators/removeLikeNotification';
import onReactionNotificationClicked from '../actions/onReactionNotificationClicked';
import removeNewMailNotification from '../mutators/removeNewMailNotification';
import removeReactionNotification from '../mutators/removeReactionNotification';
import { getHostLocation } from 'owa-url/lib/hostLocation';
import { getMailPath } from 'owa-url';
import { getOwaWorkload, OwaWorkload } from 'owa-workloads';
import { orchestrator } from 'satcheljs';
import { getUserMailboxInfo } from 'owa-client-ids';
import { popoutReadingPane } from 'owa-popout';
export default orchestrator(onNewMailNotificationClicked, message => {
    const notification: NewMailNotificationPayload = message.notification;
    // Dismiss the notification
    removeNewMailNotification(notification.ItemId);
    tryNavigateToMailItem(notification.ItemId);
});

orchestrator(onLikeNotificationClicked, message => {
    const notificationData = message.notification;
    // Dismiss the notification
    removeLikeNotification(notificationData);
    tryNavigateToMailItem(notificationData.itemId);
});

orchestrator(onReactionNotificationClicked, message => {
    const notificationData = message.notification;
    // Dismiss the notification
    removeReactionNotification(notificationData);
    tryNavigateToMailItem(notificationData.itemId);
});

function tryNavigateToMailItem(itemId: string) {
    // An orchestrator in mail will be listening for the same action, and handle as appropriate
    if (getOwaWorkload() !== OwaWorkload.Mail) {
        window.open(
            `${getMailPath()}deeplink/read/${encodeURIComponent(itemId)}` + getHostLocation().search
        );
    }
}

orchestrator(onNewMailOSNotificationClicked, message => {
    // Dismiss the notification
    removeNewMailNotification(message.itemId);
    popoutReadingPaneT(message.itemId);
});

function popoutReadingPaneT(itemId: string) {
    popoutReadingPane(itemId, null, getUserMailboxInfo());
}
