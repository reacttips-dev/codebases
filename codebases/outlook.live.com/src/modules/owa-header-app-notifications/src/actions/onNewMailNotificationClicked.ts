import { action } from 'satcheljs';
import type NewMailNotificationPayload from 'owa-service/lib/contract/NewMailNotificationPayload';

export default action(
    'ON_NEW_MAIL_NOTIFICATION_NAVIGATED',
    (notification: NewMailNotificationPayload) => ({ notification })
);
