import {
    CalendarEventCallbackPayload,
    CalendarEventInteraction,
    DoubleClickCalendarEventCallbackPayload,
} from '../schema';

export function isDoubleClickCalendarEventCallbackPayload(
    payload: CalendarEventCallbackPayload
): payload is DoubleClickCalendarEventCallbackPayload {
    return payload && payload.type === CalendarEventInteraction.DoubleClick;
}
