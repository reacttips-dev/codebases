import type { CalendarEvent } from 'owa-calendar-types';
import { isReadOnlyLocalCalendar, getCalendarEntryByFolderId } from 'owa-calendar-cache';
import { isCalendarEventLocalLie } from 'owa-calendar-event-local-lie';
import { canViewPrivateEvents } from 'owa-calendar-properties';

export default function canModify(item: CalendarEvent): boolean {
    return (
        !!item.EffectiveRights &&
        !!item.EffectiveRights.Modify &&
        !isReadOnlyLocalCalendar(item.ParentFolderId.Id) &&
        !isCalendarEventLocalLie(item) &&
        (item.Sensitivity !== 'Private' || canViewPrivateEventsOnCalendar(item.ParentFolderId.Id))
    );
}

function canViewPrivateEventsOnCalendar(folderId: string): boolean {
    const calendarEntry = getCalendarEntryByFolderId(folderId);
    return canViewPrivateEvents(calendarEntry);
}
