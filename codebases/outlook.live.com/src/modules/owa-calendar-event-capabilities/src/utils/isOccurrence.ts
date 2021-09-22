import type { CalendarItemTypeTypeEx } from 'owa-calendar-types/lib/types/CalendarEvent';

export default function isOccurrence(itemType: CalendarItemTypeTypeEx): boolean {
    return itemType === 'Occurrence';
}
