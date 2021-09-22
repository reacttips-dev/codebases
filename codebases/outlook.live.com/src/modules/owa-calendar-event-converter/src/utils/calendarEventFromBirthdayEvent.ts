import { addDays, getDate, getMonth, getYear, OwaDate, userDate, utcDate } from 'owa-datetime';
import CalendarEvent, {
    createEmptyCalendarEvent,
} from 'owa-calendar-types/lib/types/CalendarEvent';
import { getUserMailboxInfo, MailboxInfo } from 'owa-client-ids';
import type BirthdayEvent from 'owa-service/lib/contract/BirthdayEvent';
import { isDateInDateRange, DateRange } from 'owa-datetime-utils';
import getDaysInMonth from 'owa-date-utc-fn/lib/getDaysInMonth';

// TODO VSO 113957: Replace CalendarEvent client type with GraphQL CalendarEvent type
// Remove this code once we are consuming  GraphQL CalendarEvent
/**
 * Converts a Birthday event instance to CalendarEvent
 * @param birthdayEvent The Birthday event (service object) to convert
 * @param mailboxInfo The mailbox info for the calendar event
 * @returns The converted CalendarEvent object
 */
export function calendarEventFromBirthdayEvent(
    birthdayEvent: BirthdayEvent,
    parentFolderId: string,
    dateRange: DateRange,
    mailboxInfo?: MailboxInfo
): CalendarEvent {
    // If no mailboxInfo is provided then get the user mailbox info
    mailboxInfo = mailboxInfo || getUserMailboxInfo();

    // Create empty instance of CalendarEvent so that mobX doesn't freak out
    let emptyCalendarEvent = createEmptyCalendarEvent();

    // calculate event start date from the birthday
    let start = calculateCalendarItemStart(birthdayEvent.Birthday, dateRange);

    // Copy then overwrite with proper conversions
    let calendarEvent = {
        ...emptyCalendarEvent,
        ...birthdayEvent,
        Subject: birthdayEvent.Name,
        Start: start,
        End: addDays(start, 1),
        IsAllDayEvent: true,
        ParentFolderId: { Id: parentFolderId, mailboxInfo: mailboxInfo },
        ItemId: { Id: birthdayEvent.Id.Id, mailboxInfo: mailboxInfo },
        PersonId: birthdayEvent.PersonId,
        EffectiveRights: {
            Delete: true,
            Modify: true,
            Read: true,
        },
        FreeBusyType: 'Free',
        ReminderIsSet: birthdayEvent.PopupReminderSettings[0].IsReminderSet,
        ReminderMinutesBeforeStart:
            birthdayEvent.PopupReminderSettings[0].ReminderMinutesBeforeStart,
        InboxReminders: birthdayEvent.EmailReminderSettings,
    } as CalendarEvent;

    return calendarEvent;
}

/**
 * Calculates the start date of the calendar item given the birthday.
 * @param birthdayUtcIso Birthday in UTC Iso (Birthday events are always UTC format regardless of the user's timezone)
 * @returns The start date
 */
function calculateCalendarItemStart(birthdayUtcIso: string, dateRange: DateRange): OwaDate {
    const birthdayDate = utcDate(birthdayUtcIso);
    const candidate = calculateBirthdayForYear(birthdayDate, getYear(dateRange.start));

    return !isDateInDateRange(dateRange, candidate)
        ? calculateBirthdayForYear(birthdayDate, getYear(dateRange.end))
        : candidate;
}

/**
 * Uses the year/ month/ date of the UTC date we receive from the server to create a date in the user's timezone
 * @param utcBirthdayDate OwaDate Birthday in UTC
 * @param year The year
 * @returns The birthday in the year requested
 */
function calculateBirthdayForYear(utcBirthdayDate: OwaDate, year: number): OwaDate {
    const month = getMonth(utcBirthdayDate);
    const originalDay = getDate(utcBirthdayDate); // ex: feb 29 2016
    const daysInMonth = getDaysInMonth(year, month); // ex: 28 (feb 2017)
    const day = Math.min(originalDay, daysInMonth);
    return userDate(year, month, day);
}
