import { action } from 'satcheljs';
import type ParsedReminder from '../store/schema/ParsedReminder';

export default action('ON_UPDATE_ACTIVE_REMINDERS', (activeReminders: ParsedReminder[]) => ({
    activeReminders,
}));
