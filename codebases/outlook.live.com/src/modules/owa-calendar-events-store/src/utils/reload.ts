import { reloadAllCalendarEventsCache } from '../utils/eventsCache/reloadAllCalendarEventsCache';
import { clearAllFullCalendarEvents } from '../actions/publicEventsCacheActions';

export function reload() {
    clearAllFullCalendarEvents();
    return reloadAllCalendarEventsCache();
}
