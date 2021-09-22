import {
    CalendarEventCallbackPayload,
    CalendarEventInteraction,
    ClickCalendarEventCallbackPayload,
} from '../schema';

export function isClickCalendarEventCallbackPayload(
    payload: CalendarEventCallbackPayload
): payload is ClickCalendarEventCallbackPayload {
    return payload && payload.type === CalendarEventInteraction.Click;
}
