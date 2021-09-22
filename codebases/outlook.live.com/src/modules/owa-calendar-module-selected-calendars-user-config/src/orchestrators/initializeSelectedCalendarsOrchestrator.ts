import { getUserMailboxInfo } from 'owa-client-ids';
import { userConfigurationSet } from 'owa-session-store';
import { orchestrator } from 'satcheljs';
import { selectedCalendarsUpdated } from '../actions/publicActions';
import {
    updateSelectedCalendarsInStore,
    formatInitialSelectedCalendars,
} from '../actions/internalActions';
import { isConversionNeeded } from 'owa-immutable-id-store';

/**
 * When the user configuration is set for an account, updated the selected calendars in this store,
 * and dispatch a `selectedCalendarsUpdated` to let consumers know that the store value has changed
 */
orchestrator(userConfigurationSet, actionMessage => {
    const { userConfiguration, userIdentity } = actionMessage;
    let calendarIds = userConfiguration.ViewStateConfiguration.SelectedCalendarsDesktop;
    const primaryAddress = userIdentity ? userIdentity : getUserMailboxInfo().userIdentity;

    if (isConversionNeeded(calendarIds, primaryAddress)) {
        formatInitialSelectedCalendars(calendarIds, primaryAddress);
    } else {
        updateSelectedCalendarsInStore(calendarIds, primaryAddress);
        selectedCalendarsUpdated(calendarIds, primaryAddress);
    }
});
