import type BusyType from 'owa-service/lib/contract/BusyType';
import type ResponseTypeType from 'owa-service/lib/contract/ResponseTypeType';
import type CalendarEvent from 'owa-calendar-types/lib/types/CalendarEvent';
import { now } from 'owa-datetime';

// Get the local lie calendar event updates when the response type is changed
export function getCalendarEventUpdatesForResponseTypeChange(
    currentFreeBusyType: BusyType,
    currentResponseType: ResponseTypeType,
    newResponseType: ResponseTypeType
): CalendarEvent {
    let newFreeBusyType: BusyType = null;
    if (newResponseType === 'Decline') {
        newFreeBusyType = 'Free';
    } else if (currentFreeBusyType === 'Free' && currentResponseType !== 'Decline') {
        newFreeBusyType = 'Free';
    } else if (newResponseType === 'Accept') {
        newFreeBusyType = 'Busy';
    } else {
        newFreeBusyType = 'Tentative';
    }
    return {
        FreeBusyType: newFreeBusyType,
        AppointmentReplyTime: now(),
        ResponseType: newResponseType,
    } as CalendarEvent;
}
