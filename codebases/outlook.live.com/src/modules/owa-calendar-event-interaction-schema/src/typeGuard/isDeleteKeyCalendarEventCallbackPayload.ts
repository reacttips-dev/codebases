import {
    CalendarEventCallbackPayload,
    DeleteKeyCalendarEventCallbackPayload,
    CalendarEventInteraction,
} from '../schema';

export function isDeleteKeyCalendarEventCallbackPayload(
    payload: CalendarEventCallbackPayload
): payload is DeleteKeyCalendarEventCallbackPayload {
    return payload && payload.type === CalendarEventInteraction.DeleteKey;
}
