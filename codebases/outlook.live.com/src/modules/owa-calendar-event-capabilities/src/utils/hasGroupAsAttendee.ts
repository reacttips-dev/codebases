import type { CalendarEvent } from 'owa-calendar-types';
import type AttendeeType from 'owa-service/lib/contract/AttendeeType';

/**
 * Gets whether the group mailbox is also an attendee
 * @param event calendar item object
 */
export default (event: CalendarEvent): boolean => {
    if (!event) {
        return false;
    }

    let groupEmailAddress = event.ParentFolderId.mailboxInfo.mailboxSmtpAddress;
    return (
        hasGroupAttendee(event.RequiredAttendees, groupEmailAddress) ||
        hasGroupAttendee(event.OptionalAttendees, groupEmailAddress)
    );
};

function hasGroupAttendee(attendees: AttendeeType[], groupEmailAddress: string): boolean {
    return (
        attendees &&
        attendees.some(attendee => attendee.Mailbox.EmailAddress.toLowerCase() == groupEmailAddress)
    );
}
