import type { AttendeeREST } from 'owa-calendar-services/lib/store/schema/CalendarViewEventTypeREST';
import type { CalendarEvent } from 'owa-calendar-types';
import { convertRestIdToEwsId } from 'owa-identifiers';
import type AttendeeType from 'owa-service/lib/contract/AttendeeType';
import type ResponseTypeType from 'owa-service/lib/contract/ResponseTypeType';
import { parseCalendarItemDate } from 'owa-calendar-event-converter';
import getUserConfiguration from 'owa-session-store/lib/actions/getUserConfiguration';
import { getUserMailboxInfo } from 'owa-client-ids';

export function convertRESTEventsToClientEvents(serviceEvents: any[]): Partial<CalendarEvent>[] {
    const clientEvents = [];
    for (let i = 0; i < serviceEvents.length; i++) {
        const restEvent = serviceEvents[i];
        const { requiredAttendees, optionalAttendees } = convertRESTToClientAttendees(
            restEvent.Attendees
        );
        // TODO VSO 63082: Support GetCalendarView++ for connected account - when we do this we will need to plumb through this user mailbox
        // instead of using getUserMailboxInfo
        const event = {
            ItemId: { Id: convertRestIdToEwsId(restEvent.Id), mailboxInfo: getUserMailboxInfo() },
            ResponseType: convertRESTResponseStatusToResponseType(
                restEvent.ResponseStatus?.Response
            ),
            AppointmentReplyTime: parseCalendarItemDate(
                getAppointmentReplyTime(restEvent.Attendees)
            ),
            IsOnlineMeeting: restEvent.IsOnlineMeeting,
            OnlineMeetingProvider: restEvent.OnlineMeetingProvider,
            OnlineMeetingJoinUrl: restEvent.OnlineMeeting?.JoinUrl,
            /* Locations: restEvent.Locations, Commented, as this is causing a client exception. Opened below bug to track a fix.
            Bug 79561: Update Locations property from calendarview response
            */
            RequiredAttendees: requiredAttendees,
            OptionalAttendees: optionalAttendees,
        } as CalendarEvent;
        clientEvents.push(event);
    }

    return clientEvents;
}

/**
 * Convert REST ResponseStatus to EWS ResponseTypeType
 * @param response
 */
function convertRESTResponseStatusToResponseType(response: string): ResponseTypeType {
    let responseType;
    switch (response) {
        case 'Accepted':
            responseType = 'Accept';
            break;
        case 'TentativelyAccepted':
            responseType = 'Tentative';
            break;
        case 'Organizer':
            responseType = 'Organizer';
            break;
        case 'Declined':
            responseType = 'Decline';
            break;
        case 'NotResponded':
            responseType = 'NoResponseReceived';
            break;
        default:
            responseType = 'Unknown';
            break;
    }
    return responseType;
}

function convertRESTToClientAttendees(
    attendees: AttendeeREST[]
): { requiredAttendees: AttendeeType[]; optionalAttendees: AttendeeType[] } {
    const required = [];
    const optional = [];
    attendees?.forEach(attendee => {
        const attendeeType = {
            Mailbox: {
                Name: attendee.EmailAddress?.Name,
                EmailAddress: attendee.EmailAddress?.Address,
            },
            ResponseType: convertRESTResponseStatusToResponseType(attendee.Status?.Response),
            LastResponseTime: attendee.Status?.Time,
        };
        if (attendee.Type == 'Required') {
            required.push(attendeeType);
        } else if (attendee.Type == 'Optional') {
            optional.push(attendeeType);
        }
    });

    return { requiredAttendees: required, optionalAttendees: optional };
}

/**
 * Compute AppointmentReplyTime from attendee.Status.Time if the attendee is user self, which is
 * the same way that AppointmentReplyTime is calculated on EWS.
 */
function getAppointmentReplyTime(attendees: AttendeeREST[]): string | null {
    if (!attendees) {
        return null;
    }

    for (let i = 0; i < attendees.length; i++) {
        const attendee = attendees[i];
        if (isSelf(attendee.EmailAddress)) {
            return attendee.Status?.Time;
        }
    }

    return null;
}

function isSameStringIgnoreCase(str1: string, str2: string): boolean {
    return str1 === str2 || (str1 && str2 && str1.toLowerCase() == str2.toLowerCase());
}

function isSelf(address: any): boolean {
    return (
        address &&
        isSameStringIgnoreCase(
            address.Address,
            getUserConfiguration().SessionSettings.UserEmailAddress
        )
    );
}
