import { action } from 'satcheljs';

export default action('REFRESH_REMINDERS', (userIdentity: string | null) => ({
    userIdentity,
}));
