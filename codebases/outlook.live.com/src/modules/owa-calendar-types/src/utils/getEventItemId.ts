import type CalendarEvent from '../types/CalendarEvent';

export default function getEventItemId(
    event: CalendarEvent | Partial<CalendarEvent>
): string | undefined {
    return event?.ItemId?.Id;
}
