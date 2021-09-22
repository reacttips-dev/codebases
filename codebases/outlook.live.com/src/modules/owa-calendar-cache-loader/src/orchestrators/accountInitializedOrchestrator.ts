import { orchestrator } from 'satcheljs';
import { owaConnectedAccountAdded } from 'owa-account-store-init';
import { initializeCalendarsCache, ConnectedAccountInfo } from '../utils/initializeCalendarCache';
import { CalendarEndpointType } from '../store/schema/CalendarEndpointType';
import { isFeatureEnabled } from 'owa-feature-flags';

/**
 * Loads the calendars cache when an account is initialized
 */
orchestrator(owaConnectedAccountAdded, actionMessage => {
    const { userIdentity, source } = actionMessage;
    const connectedAccountInfo: ConnectedAccountInfo = {
        userIdentity: userIdentity,
        source: source,
    };
    initializeCalendarsCache(CalendarEndpointType.Outlook, connectedAccountInfo);
    if (isFeatureEnabled('cal-multiAccounts-groups')) {
        initializeCalendarsCache(CalendarEndpointType.OutlookGroup, connectedAccountInfo);
    }
});
