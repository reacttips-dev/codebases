import {
    CalendarEventCallbackPayload,
    CalendarEventInteraction,
    RightClickCalendarEventCallbackPayload,
} from '../schema';

export function isRightClickCalendarEventCallbackPayload(
    payload: CalendarEventCallbackPayload
): payload is RightClickCalendarEventCallbackPayload {
    return payload && payload.type === CalendarEventInteraction.RightClick;
}
