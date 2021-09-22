import { poll, cancelPoll } from 'owa-request-manager';
import { reloadLinkedCalendarEventsCache } from '../utils/eventsCache/reloadLinkedCalendarEventsCache';

const FIVE_MINUTES_IN_MS = 5 * 60 * 1000;

/**
 * This initializes free busy reloading every 5 minutes. This is especially useful when users have old sharing model
 * calendars and since there is no notification, periodic polling helps to have the latest f/b on surface.
 * */
export function managePollingForLinkedCalendars(startPolling: boolean) {
    if (startPolling) {
        poll(reloadLinkedCalendarEventsCache, 'RELOAD_LINKEDCALENDAR_ENTRIES', FIVE_MINUTES_IN_MS);
    } else {
        cancelPoll('RELOAD_LINKEDCALENDAR_ENTRIES');
    }
}
