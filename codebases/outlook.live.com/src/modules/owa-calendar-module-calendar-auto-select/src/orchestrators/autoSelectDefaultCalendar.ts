import {
    addSelectedCalendar,
    isSelectedCalendarsInitialized,
} from 'owa-calendar-module-selected-calendars-user-config';
import { getDefaultCalendar } from 'owa-calendar-cache';
import { isWorkLifeViewEnabledForUser } from 'owa-calendar-worklifeviewoption';
import { CalendarEndpointType, areAllEndpointsLoaded } from 'owa-calendar-cache-loader';
import { hasValidSelectedCalendars } from './hasValidSelectedCalendars';

export function autoSelectDefaultCalendar(userIdentity: string) {
    // Auto-select default calendar if nothing is selected
    // do this only if corresponding work/life view is enabled in user options
    if (isWorkLifeViewEnabledForUser(userIdentity)) {
        const defaultCalendar = getDefaultCalendar(userIdentity);
        if (defaultCalendar) {
            addSelectedCalendar(defaultCalendar.calendarId.id, userIdentity);
        }
    }
}

/**
 * We are able to auto select a calendar for an account when the calendar cache is loaded for this account,
 * so when the calendar cache is initialized for an account, we check if we want to auto select
 */
export function tryAutoSelect(userId: string, calendarEndpointType?: CalendarEndpointType) {
    if (
        !hasValidSelectedCalendars(userId) &&
        isSelectedCalendarsInitialized(userId) &&
        areAllEndpointsLoaded(userId)
    ) {
        autoSelectDefaultCalendar(userId);
    }
}
