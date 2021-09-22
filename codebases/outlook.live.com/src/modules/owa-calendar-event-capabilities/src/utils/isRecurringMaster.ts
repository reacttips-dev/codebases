import type { CalendarItemTypeTypeEx } from 'owa-calendar-types/lib/types/CalendarEvent';

export default function isRecurringMaster(itemType: CalendarItemTypeTypeEx): boolean {
    return itemType === 'RecurringMaster';
}
