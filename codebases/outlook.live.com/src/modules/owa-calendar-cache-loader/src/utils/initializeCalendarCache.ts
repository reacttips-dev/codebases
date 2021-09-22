import { addToLoadedCalendarAccounts } from '../actions/internalActions';
import * as trace from 'owa-trace';
import { isLoaded } from '../selectors/isLoaded';
import { CalendarEndpointType } from '../store/schema/CalendarEndpointType';
import { calendarCacheInitializedForAccount } from '../actions/publicActions';
import { getAccountIdentifier } from './getAccountIdentifier';
import { initializeCalendarsCacheForAccount } from './initializeCalendarsCacheForAccount';
import { createRetriableFunc } from './createRetriableFunction';
import { getUserMailboxInfo } from 'owa-client-ids';
import { isConnectedAccount } from 'owa-accounts-store';
import { allCalendarAccountsAndCacheLoaded } from 'owa-calendar-account-store';
import { OwaConnectedAccountInitSource } from 'owa-account-store-init';

interface FetchingCalendarsInfo {
    requestPromise: Promise<void>;
}

export interface ConnectedAccountInfo {
    userIdentity: string;
    source: OwaConnectedAccountInitSource;
}

const fetchingCalendarsInfoMap: { [userIdentity: string]: FetchingCalendarsInfo } = {};

/**
 * Initializes calendars from the various endpoints in the calendar cache by calling enpoint
 * specific api logic which fetches calendars and adds the calendars to the cache.
 * @param calendarEndpointType the endpoint to fetch calendars from
 * @param userIdentity userIdentity of the account to initialize
 */
export function initializeCalendarsCache(calendarEndpointType: CalendarEndpointType.TeamsCalendars);
export function initializeCalendarsCache(
    calendarEndpointType: CalendarEndpointType.OutlookGroup,
    connectedAccountInfo?: ConnectedAccountInfo
);
export function initializeCalendarsCache(
    calendarEndpointType: CalendarEndpointType.Outlook,
    connectedAccountInfo?: ConnectedAccountInfo
);
export function initializeCalendarsCache(
    calendarEndpointType: CalendarEndpointType,
    connectedAccountInfo?: ConnectedAccountInfo
): Promise<void> {
    const userId = connectedAccountInfo
        ? connectedAccountInfo.userIdentity
        : getUserMailboxInfo().userIdentity;
    const isConnected = isConnectedAccount(userId);
    // case 1: The data is already loaded into the cache, we resolve
    const isCalendarAccountLoaded = isLoaded(calendarEndpointType, userId);
    if (isCalendarAccountLoaded) {
        return Promise.resolve();
    }

    const accountId = getAccountIdentifier(calendarEndpointType, userId);
    // case 2: there is already a request for a given account, we return the existing promise
    const existingRequest = fetchingCalendarsInfoMap[accountId];
    if (existingRequest) {
        return existingRequest.requestPromise;
    }
    // case 3: The data must be requested from the service, create a service request w/ retries
    const currentRequest = createRetriableFunc(() =>
        initializeCalendarsCacheForAccount(calendarEndpointType, userId)
    );
    const promise = currentRequest.retriableFunc();
    fetchingCalendarsInfoMap[accountId] = { requestPromise: promise };
    return promise
        .then(() => {
            addToLoadedCalendarAccounts(accountId);
            calendarCacheInitializedForAccount(
                calendarEndpointType,
                userId,
                connectedAccountInfo?.source
            );
            // allCalendarAccountsAndCacheLoaded action fired in accounts store init orchestration if there's no connected account
            if (isConnected && calendarEndpointType == CalendarEndpointType.Outlook) {
                allCalendarAccountsAndCacheLoaded(true /* isSuccess */, userId);
            }
        })
        .catch(error => {
            trace.errorThatWillCauseAlert(
                'initializeCalendarsCacheForAccount: failed to initialize calendar cache',
                error
            );
        });
}
