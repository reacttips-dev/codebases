import type NewMailNotificationPayload from 'owa-service/lib/contract/NewMailNotificationPayload';
import { action } from 'satcheljs';

export default action('NEW_MAIL_NOTIFICATION', (notification: NewMailNotificationPayload) => ({
    notification,
}));
