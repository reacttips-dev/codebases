import { action } from 'satcheljs';
import type { AccountProviderType } from 'owa-accounts-store';
import { OwaConnectedAccountInitSource } from '../schema/OwaConnectedAccountInitSource';

/**
 * Initializes the OWA Account Store.
 * The store responds by loading the existing connected accounts from the user's mailbox.
 * @param isRetry to be true if this is a second attempt at initializing the account store
 */
export const initializeOwaAccountsStore = action('initializeOwaAccountsStore');
/**
 * Action dispatched after a connected account is successfully initialized in `owa-session-store` and `owa-account-store`.
 * This is triggered as accounts are initialized during initialization (via `initializeOwaAccountStore`), as well as when an account is initialized when
 * connected (via `connectOwaAccount`).
 */
export const owaConnectedAccountAdded = action(
    'owaConnectedAccountAdded',
    (
        userIdentity: string,
        accountProviderType: AccountProviderType,
        source: OwaConnectedAccountInitSource
    ) => ({
        userIdentity,
        accountProviderType,
        source,
    })
);

/**
 * Removes an account.
 */
export const removeOWAConnectedAccount = action('removeAccount', (userIdentity: string) => ({
    userIdentity,
}));

export const owaAccountStoreInitializationFailed = action(
    'owaAccountStoreInitializationFailed',
    (
        userIdentity: string,
        isRetry: boolean,
        accountProvider: AccountProviderType,
        error: string
    ) => ({
        userIdentity,
        isRetry,
        accountProvider,
        error,
    })
);
