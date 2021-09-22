import { action } from 'satcheljs';

export default action('ON_NEW_MAIL_OS_NOTIFICATION_NAVIGATED', (itemId: string) => ({
    itemId,
}));
