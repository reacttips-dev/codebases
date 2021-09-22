import isMeetingOnCalendarSharedWithMe from './isMeetingOnCalendarSharedWithMe';
import isOnGroupCalendar from './isOnGroupCalendar';
import type { CalendarEvent } from 'owa-calendar-types';
import { isFeatureEnabled } from 'owa-feature-flags';

/**
 * Returns true if event can be acted on "from this date forward"
 * This happens if flight is on and event is not on shared calendar
 * @param event Calendar event
 */
export default function canActFromThisDateForward(event: CalendarEvent): boolean {
    if (isOnGroupCalendar(event)) {
        return true;
    }

    if (isMeetingOnCalendarSharedWithMe(event)) {
        // If it's a shared calendar, then enable FTDF if the flight cal-mf-enableFTDFOnSharedCalendar is on
        return isFeatureEnabled('cal-mf-enableFTDFOnSharedCalendar');
    }

    return true;
}
