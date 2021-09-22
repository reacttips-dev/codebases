import { orchestrator } from 'satcheljs';
import {
    selectedCalendarsUpdated,
    getSelectedCalendarsCount,
    isSelectedCalendarsInitialized,
} from 'owa-calendar-module-selected-calendars-user-config';
import { initialize } from '../actions/internalActions';
import { autoSelectDefaultCalendar } from './autoSelectDefaultCalendar';
import { getPrimaryAndConnectedAccountsEmailAddresses } from 'owa-session-store';
import { isLoaded, CalendarEndpointType, areAllEndpointsLoaded } from 'owa-calendar-cache-loader';
import { getUserMailboxInfo } from 'owa-client-ids';
import { hasValidSelectedCalendars } from './hasValidSelectedCalendars';

/**
 * We want to auto-select calendars in two cases:
 * 1. We do not have any selected calendars for an account on load. In this case, we select the
 * default calendar for the account. This is logic is in `owa-calendar-surface-view-store/lib/orchestrators/calendarCacheOrchestrators.ts`
 * 2. The user unselects their last selected calendar for any account (i.e. they have 0 selected calendars across all their accounts).
 * In this case we want to auto-select the primary account default calendar.
 */

// TODO VSO 90364: Fix race condition which allows `owa-calendar-module-calendar-auto-select` to auto-select
// the default calendar if the groups calendars have not loaded yet

/**
 * When this module loads, we auto select as needed for the accounts that are loaded
 */
export const initializeOrchestrator = orchestrator(initialize, () => {
    getPrimaryAndConnectedAccountsEmailAddresses().forEach(smtpAddress => {
        if (
            areAllEndpointsLoaded(smtpAddress) &&
            isSelectedCalendarsInitialized(smtpAddress) &&
            !hasValidSelectedCalendars(smtpAddress)
        ) {
            autoSelectDefaultCalendar(smtpAddress);
        }
    });
});

/**
 * When a user updates the selected calendars, if there are no selected calendars
 * select the default calendar of the primary account.
 */
export const onSelectedCalendarsUpdatedOrchestrator = orchestrator(selectedCalendarsUpdated, () => {
    const smtpAddress = getUserMailboxInfo().userIdentity;
    if (getSelectedCalendarsCount() === 0 && isLoaded(CalendarEndpointType.Outlook, smtpAddress)) {
        autoSelectDefaultCalendar(smtpAddress);
    }
});
