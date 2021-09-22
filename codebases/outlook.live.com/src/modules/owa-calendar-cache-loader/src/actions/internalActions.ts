import { action } from 'satcheljs';

export const addToLoadedCalendarAccounts = action(
    'addToLoadedCalendarAccounts',
    (calendarAccountData: string) => ({
        calendarAccountData,
    })
);
