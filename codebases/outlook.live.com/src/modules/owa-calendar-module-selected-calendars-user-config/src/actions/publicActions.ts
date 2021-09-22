import { action } from 'satcheljs';

export const updateSelectedCalendars = action(
    'UPDATE_SELECTED_CALENDARS',
    (calendarIds: string[], userIdentity: string) => ({ calendarIds, userIdentity })
);

export const addSelectedCalendar = action(
    'ADD_SELECTED_CALENDAR',
    (calendarId: string, userIdentity: string) => ({ calendarId, userIdentity })
);

export const initializeSelectedCalendars = action(
    'INITIALIZE_SELECTED_CALENDARS',
    (calendarIds: string[], userIdentity: string) => ({ calendarIds, userIdentity })
);

export const selectedCalendarsUpdated = action(
    'SELECTED_CALENDARS_UPDATED',
    (calendarIds: string[], userIdentity: string) => ({ calendarIds, userIdentity })
);

export const refreshImmutableSelectedCalendars = action(
    'REFRESH_IMMUTABLE_SELECTED_CALENDARS',
    (userIdentity: string) => ({ userIdentity })
);
