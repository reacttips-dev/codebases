import { getOWAConnectedAccounts } from 'owa-accounts-store';
import { initializeCalendarsCache, ConnectedAccountInfo } from '../utils/initializeCalendarCache';
import { CalendarEndpointType } from '../store/schema/CalendarEndpointType';
import { isFeatureEnabled } from 'owa-feature-flags';
import { getUserConfigurationForUser } from 'owa-session-store';
import { OwaConnectedAccountInitSource } from 'owa-account-store-init';

/**
 * gets all loaded accounts and loads their data
 */
export async function initializeAllLoadedAccounts(): Promise<void> {
    // Initialize cache for primary account
    const defaultMailboxPromise = initializeCalendarsCache(CalendarEndpointType.Outlook);

    /**
     * Initialize the cache for all **loaded** connected accounts (both to accounts store and session store)
     * Not all accounts are guaranteed to be loaded when this is called. This package listens to the
     * `owaConnectedAccountAdded` to initialize connected accounts as they are initialized
     * */
    const connectedAccountPromises = getOWAConnectedAccounts().map(account => {
        if (getUserConfigurationForUser(account.userIdentity)) {
            const connectedAccountInfo: ConnectedAccountInfo = {
                userIdentity: account.userIdentity,
                source: OwaConnectedAccountInitSource.Init,
            };
            initializeCalendarsCache(CalendarEndpointType.Outlook, connectedAccountInfo);
        }
    });

    // Initialize group calendars for primary account
    const defaultMailboxGroupPromise = initializeCalendarsCache(CalendarEndpointType.OutlookGroup);

    // Initialize Teams channels calendars
    const teamsCalendarsAccountPromise = initializeCalendarsCache(
        CalendarEndpointType.TeamsCalendars
    );

    let promises = [
        defaultMailboxPromise,
        defaultMailboxGroupPromise,
        ...connectedAccountPromises,
        teamsCalendarsAccountPromise,
    ];

    if (isFeatureEnabled('cal-multiAccounts-groups')) {
        // Initialize group calendars for all loaded connected accounts
        const connectedAccountGroupPromises = getOWAConnectedAccounts().map(account => {
            if (getUserConfigurationForUser(account.userIdentity)) {
                const connectedAccountInfo: ConnectedAccountInfo = {
                    userIdentity: account.userIdentity,
                    source: OwaConnectedAccountInitSource.Init,
                };
                initializeCalendarsCache(CalendarEndpointType.OutlookGroup, connectedAccountInfo);
            }
        });

        promises = promises.concat(connectedAccountGroupPromises);
    }

    await Promise.all(promises);
}
