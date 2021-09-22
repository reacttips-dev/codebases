import { action } from 'satcheljs';

export const updateSelectedCalendarsInStore = action(
    'UPDATE_SELECTED_CALENDARS_IN_STORE',
    (calendarIds: string[], userIdentity: string) => ({ calendarIds, userIdentity })
);

export const addSelectedCalendarInStore = action(
    'ADD_SELECTED_CALENDAR_IN_STORE',
    (calendarId: string, userIdentity: string) => ({ calendarId, userIdentity })
);

export const formatInitialSelectedCalendars = action(
    'FORMAT_INITIAL_SELECTED_CALENDARS',
    (ids: string[], userIdentity: string) => ({
        ids,
        userIdentity,
    })
);
