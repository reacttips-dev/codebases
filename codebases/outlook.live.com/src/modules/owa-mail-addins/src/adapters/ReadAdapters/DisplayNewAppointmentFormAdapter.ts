import type AttendeeType from 'owa-service/lib/contract/AttendeeType';
import type BodyContentType from 'owa-service/lib/contract/BodyContentType';
import type EmailAddressWrapper from 'owa-service/lib/contract/EmailAddressWrapper';
import emailAddressWrapperToAttendeeType from '../../utils/emailAddressWrapperToAttendeeType';
import type EnhancedLocation from 'owa-service/lib/contract/EnhancedLocation';
import {
    createEnhancedLocationsFromPersonaControlViewState,
    createLocationPersonaFromStringLocation,
} from 'owa-location-persona';
import { lazyPopoutCalendarCompose, SerializableCalendarEvent } from 'owa-popout-calendar';

export const displayNewAppointmentForm = (
    requiredAttendees?: EmailAddressWrapper[],
    optionalAttendees?: EmailAddressWrapper[],
    start?: number,
    end?: number,
    location?: string,
    resources?: string[],
    subject?: string,
    body?: string
) => {
    const required = emailAddressWrapperToAttendeeType(requiredAttendees);
    const optional = emailAddressWrapperToAttendeeType(optionalAttendees);

    // For start and end, 0 means the Unix epoch.
    // For start, null/undefined becomes "now".
    // For end, null/undefined becomes undefined so it is not sent.
    const startTime = new Date(start == void 0 ? Date.now() : start);
    const endTime = end == void 0 ? undefined : new Date(end);

    let enhancedLocation: EnhancedLocation;
    if (location) {
        const viewstate = createLocationPersonaFromStringLocation(location);
        enhancedLocation = createEnhancedLocationsFromPersonaControlViewState(viewstate)[0];
    }

    const convertedResources = resources
        ? resources.map(res => {
              return <AttendeeType>{
                  Mailbox: { EmailAddress: res },
              };
          })
        : null;
    const bodyContent: BodyContentType = {
        Value: body,
        BodyType: 'HTML',
    };
    const calendarItem: SerializableCalendarEvent = {
        RequiredAttendees: required || [],
        OptionalAttendees: optional || [],
        Locations: enhancedLocation ? [enhancedLocation] : [],
        Resources: convertedResources || [],
        Subject: subject,
        Body: bodyContent,
        Start: startTime,
        End: endTime,
    };

    // TODO: CAL-PROJECTION Unify with Calendar addins, remove SerializableCalendarEvent
    lazyPopoutCalendarCompose.importAndExecute(
        calendarItem,
        'Mail_AddIns',
        true /* eventHasUpdates */
    );
};
