import type { CalendarEvent } from 'owa-calendar-types';

export default function isSavedMeetingDraft(item: CalendarEvent): boolean {
    return !!(item.ItemId && item.IsDraft && item.IsMeeting && item.IsOrganizer);
}
