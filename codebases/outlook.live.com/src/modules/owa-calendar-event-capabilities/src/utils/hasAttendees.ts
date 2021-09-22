import type AttendeeType from 'owa-service/lib/contract/AttendeeType';
import type { CalendarEvent } from 'owa-calendar-types';
import isOnGroupCalendar from './isOnGroupCalendar';

/**
 * Returns true if the event has attendees (whether required, optional or resources)
 * Filters out the organizer if present in the attendee list
 * @param event The event to check
 * @param ignoreResources Filters out the resources (when it's true)
 */
export default function hasAttendeesBesidesOrganizer(
    event: CalendarEvent,
    ignoreResources?: boolean
): boolean {
    if (!event) {
        return false;
    }

    // For a group mailbox, adding the group(organizer) as an attendee has special meaning, as it sends the invite to the group members,
    // so we will leave attendees intact for group mailbox.
    let shouldRemoveOrganizer = !isOnGroupCalendar(event);

    const removeOrganizerIfNeeded = (attendees: AttendeeType[]): AttendeeType[] =>
        attendees
            ? shouldRemoveOrganizer
                ? attendees.filter(
                      attendee =>
                          !event.Organizer ||
                          attendee.Mailbox.EmailAddress != event.Organizer.Mailbox.EmailAddress
                  )
                : attendees
            : [];

    const requiredAttendees = removeOrganizerIfNeeded(event.RequiredAttendees).length;
    const optionalAttendees = removeOrganizerIfNeeded(event.OptionalAttendees).length;

    if (ignoreResources) {
        return requiredAttendees + optionalAttendees > 0;
    }

    const resources = removeOrganizerIfNeeded(event.Resources).length;

    return requiredAttendees + optionalAttendees + resources > 0;
}

export function hasRequiredOrOptionalAttendees(event: CalendarEvent) {
    const requiredAttendees = event.RequiredAttendees;
    const optionalAttendees = event.OptionalAttendees;
    return (
        (requiredAttendees && requiredAttendees.length != 0) ||
        (optionalAttendees && optionalAttendees.length != 0)
    );
}
