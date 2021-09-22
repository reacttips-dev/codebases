import { getSelectedCalendarsForUser } from 'owa-calendar-module-selected-calendars-user-config';
import { getCalendarEntryByCalendarId } from 'owa-calendar-cache';

/**
 * Checks if an account has any valid selected calendars. In other words, it checks the user has selected calendars that are in the
 * cache. This should only be used after the calendar cache is loaded for smtpAddress.
 * @param smtpAddress
 */
export function hasValidSelectedCalendars(smtpAddress: string) {
    return getSelectedCalendarsForUser(smtpAddress)
        .map(getCalendarEntryByCalendarId)
        .some(calendar => !!calendar);
}
