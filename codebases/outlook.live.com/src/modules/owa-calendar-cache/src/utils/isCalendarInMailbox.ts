import type { CalendarEntry, LinkedCalendarEntry } from 'owa-graph-schema';
import { isLinkedCalendarEntry } from 'owa-calendar-properties';
import getUserConfiguration from 'owa-session-store/lib/actions/getUserConfiguration';

/**
 * Checks if a given calendar belongs to the specified mailbox
 * @param calendarEntry calendar to check
 * @param {string} emailAddress the mailbox owner of the calendars
 */
export default function isCalendarInMailbox(
    calendarEntry: CalendarEntry,
    emailAddress: string
): boolean {
    if (isLinkedCalendarEntry(calendarEntry)) {
        let linkedCalendarEntry = calendarEntry as LinkedCalendarEntry;
        return (
            !linkedCalendarEntry.IsOwnerEmailAddressInvalid &&
            linkedCalendarEntry.OwnerEmailAddress == emailAddress
        );
    }

    if (calendarEntry.calendarId?.mailboxInfo) {
        return emailAddress.indexOf(calendarEntry.calendarId.mailboxInfo.mailboxSmtpAddress) >= 0;
    } else {
        return getUserConfiguration().SessionSettings.UserEmailAddress == emailAddress;
    }
}
