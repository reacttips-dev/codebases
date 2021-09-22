import { action } from 'satcheljs';

// action fired after owa accounts store is fully loaded including time for checking if
// there is a connected account and then loading that data into the calendar cache
export const allCalendarAccountsAndCacheLoaded = action(
    'allCalendarAccountsAndCacheLoaded',
    (isSuccess: boolean, userIdentity?: string) => ({ isSuccess, userIdentity })
);

// action fired when we have removed calendar ids from persisted data objects due to connected
// account removal and we should render the accounts error dialog
export const removedConnectedAccountIdCleanup = action('removedConnectedAccountIdCleanup');
