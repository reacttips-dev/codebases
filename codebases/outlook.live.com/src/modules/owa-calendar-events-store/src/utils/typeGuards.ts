import type CalendarEvent from 'owa-calendar-types/lib/types/CalendarEvent';
import type { CalendarEventEntity } from '../store/schema/CalendarEventEntity';

export function isCalendarEventEntity(
    calendarEvent: CalendarEvent
): calendarEvent is CalendarEventEntity {
    const typeCastedCalendarEventEntity = calendarEvent as CalendarEventEntity;

    return (
        !!typeCastedCalendarEventEntity.Key &&
        typeCastedCalendarEventEntity.Start !== undefined &&
        typeCastedCalendarEventEntity.End !== undefined
    );
}
