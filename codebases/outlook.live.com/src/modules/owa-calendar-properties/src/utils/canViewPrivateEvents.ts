import type { CalendarEntry, LocalCalendarEntry } from 'owa-graph-schema';

import { isLinkedCalendarEntry } from './isLinkedCalendarEntry';

export function canViewPrivateEvents(calendarEntry: CalendarEntry): boolean {
    // In the Linked Calendar case we do not get the CanViewPrivateItems property, or any
    // other properties that can be used to decide if a calendar entry is editable.
    // We assume the calendar can be edited in this case, and allow the client to fail on event update
    // if the user does not have permissions.
    return (
        (calendarEntry as LocalCalendarEntry).CanViewPrivateItems ||
        isLinkedCalendarEntry(calendarEntry)
    );
}
