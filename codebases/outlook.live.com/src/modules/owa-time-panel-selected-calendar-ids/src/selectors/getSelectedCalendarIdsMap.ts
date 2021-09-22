import { getSelectedCalendarsFromTimePanel } from './getSelectedCalendarsFromTimePanel';
import { hasTimePanelSelectedCalendars } from './hasTimePanelSelectedCalendars';
import { getTimePanelConfigLoadStates } from '../selectors/getTimePanelConfigLoadStates';
import { ConfigLoadState } from '../store/schema/TimePanelSelectedCalendarIdsStore';
import { ObservableMap } from 'mobx';
import { getOWAConnectedAccounts } from 'owa-accounts-store';
import { getDefaultCalendar } from 'owa-calendar-cache';
import {
    getSelectedCalendars as getSelectedCalendarsFromCalendarModule,
    getSelectedCalendarsCount as getSelectedCalendarsCountFromCalendarModule,
} from 'owa-calendar-module-selected-calendars-user-config';
import { getUserMailboxInfo } from 'owa-client-ids';

/**
 * Gets selected calendarIds as a map of accounts to calendarIds.
 *
 * The selected calendars for an account will be the Time Panel config's selected calendars if:
 * 1. the user has selected a timepanel calendar for any account AND
 * 2. we did not fail to load calendars for the account.
 *
 * Else the selected calendars for an account will fallback to the Calendar module config's selected calendars (if any).
 *
 * Worst-case, we will auto-select the default calendar of each account.
 */
export function getTimePanelSelectedCalendarIdsMap(): ObservableMap<string, string[]> {
    // reference Time Panel config while loading settings or if settings are loaded and non-empty
    const configLoadStates = getTimePanelConfigLoadStates();
    const isNotInitialized = configLoadStates.size === 0;
    const selectedCalendars: ObservableMap<string, string[]> = new ObservableMap<
        string,
        string[]
    >();

    if (isNotInitialized) {
        return selectedCalendars;
    }

    getAllAccounts().forEach(userIdentity => {
        if (
            hasTimePanelSelectedCalendars() &&
            configLoadStates.get(userIdentity) !== ConfigLoadState.Failed
        ) {
            selectedCalendars.set(
                userIdentity,
                getSelectedCalendarsFromTimePanel().get(userIdentity)
            );
        } else if (getSelectedCalendarsCountFromCalendarModule() > 0) {
            selectedCalendars.set(
                userIdentity,
                getSelectedCalendarsFromCalendarModule().get(userIdentity)
            );
        } else {
            const defaultCalendar = getDefaultCalendar(userIdentity);
            if (defaultCalendar) {
                selectedCalendars.set(userIdentity, [defaultCalendar.calendarId.id]);
            }
        }
    });

    return selectedCalendars;
}

function getAllAccounts(): string[] {
    return [
        getUserMailboxInfo().userIdentity,
        ...getOWAConnectedAccounts().map(account => account.userIdentity),
    ];
}
