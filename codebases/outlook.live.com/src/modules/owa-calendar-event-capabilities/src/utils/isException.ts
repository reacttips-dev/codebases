import type { CalendarItemTypeTypeEx } from 'owa-calendar-types/lib/types/CalendarEvent';

export default function isException(itemType: CalendarItemTypeTypeEx): boolean {
    return itemType === 'Exception';
}
