import { getAccountFromCalendarId } from './getAccountFromCalendarId';

export function getAccountsMapFromCalendarIds(calendarIds: string[]) {
    const accountsMap = new Map();
    calendarIds.forEach(calendarId => {
        const account = getAccountFromCalendarId(calendarId);
        if (accountsMap.has(account)) {
            const currValue = accountsMap.get(account);
            currValue.push(calendarId);
            accountsMap.set(account, currValue);
        } else {
            accountsMap.set(account, [calendarId]);
        }
    });
    return accountsMap;
}
