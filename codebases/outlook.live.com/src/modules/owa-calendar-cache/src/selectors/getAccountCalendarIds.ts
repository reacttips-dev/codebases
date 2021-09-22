import { getCalendarEntries } from './calendarsCacheSelectors';
import { isCalendarInAccount } from '../utils/compareCalendarUtils';

export function getAccountCalendarIds(userIdentity: string): string[] {
    const calendarEntriesInAccount = [];
    getCalendarEntries().forEach(calendarEntry => {
        if (isCalendarInAccount(calendarEntry, userIdentity)) {
            calendarEntriesInAccount.push(calendarEntry.calendarId.id);
        }
    });
    return calendarEntriesInAccount;
}
