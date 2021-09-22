import { sending } from 'owa-locstrings/lib/strings/sending.locstring.json';
import { undoAction } from 'owa-locstrings/lib/strings/undoaction.locstring.json';
import loc from 'owa-localize';
import { PerformanceDatapoint, logUsage } from 'owa-analytics';
import { ControlIcons } from 'owa-control-icons';
import { lazyUndoLatestDelayedMailItem } from '../index';
import { getListViewNotificationDimensions } from 'owa-mail-layout/lib/utils/getListViewNotificationDimensions';
import { lazyShowNotification, NotificationBarCallbackReason } from 'owa-notification-bar';

const SEND_NOTIFICATION_ID = 'sendNotification';

export default function showNotificationOnSend(delaySendIntervalMilliseconds: number) {
    const timeBeforeCancelSendDatapoint = new PerformanceDatapoint(
        'UndoSend_SendCancelledTimeElapsed'
    );
    logUsage('UndoSend_SendBarShown');

    const notificationDimensions = getListViewNotificationDimensions();
    lazyShowNotification.importAndExecute(
        SEND_NOTIFICATION_ID,
        'MailModuleNotificationBarHost',
        loc(sending),
        {
            icon: ControlIcons.Send,
            primaryActionText: loc(undoAction),
            allowAutoDismiss: true,
            autoDismissInSeconds: delaySendIntervalMilliseconds / 1000,
            minWidth: notificationDimensions.minWidth,
            maxWidth: notificationDimensions.maxWidth,
            notificationCallback: reason => {
                if (reason === NotificationBarCallbackReason.PrimaryActionClicked) {
                    lazyUndoLatestDelayedMailItem.importAndExecute();

                    timeBeforeCancelSendDatapoint.end();
                    logUsage('UndoSend_SendCancelled');
                }
            },
        }
    );
}
