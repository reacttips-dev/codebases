import { action } from 'satcheljs';
import {
    OWAConnectedAccount,
    OWAConnectedAccountState,
    AccountProviderType,
} from './store/schema/OWAConnectedAccount';
import { addDatapointConfig } from 'owa-analytics-actions';
import type { AccountsStoreState } from './store/schema/AccountsStoreState';

/**
 * Adds an account to the store.
 * The store responds by loading the user configuration of this account.
 */
export const addOWAConnectedAccount = action('addAccount', (account: OWAConnectedAccount) => ({
    userIdentity: account.userIdentity,
    account,
}));

/**
 * Removes an account to the store.
 */
export const removeOWAConnectedAccount = action('removeAccount', (userIdentity: string) => ({
    userIdentity,
}));

/**
 * Updates an account to the store.
 */
export const updateOWAConnectedAccountToken = action(
    'updateAccount',
    (userIdentity: string, accountToken: string, accountTokenExpiresIn: number) => ({
        userIdentity: userIdentity,
        accountToken: accountToken,
        accountTokenExpiresIn: accountTokenExpiresIn,
    })
);

/**
 * Updates the OWA Connected account status
 */
export const updateOWAConnectedAccountStatus = action(
    'updateOWAConnectedAccountStatus',
    (userIdentity: string, accountState: OWAConnectedAccountState) => ({
        userIdentity,
        accountState,
    })
);

/**
 * Triggered whenever connected account is determined to be in error state
 */
export const connectedAccountInErrorState = action(
    'connectedAccountIsInErrorState',
    (accountState: OWAConnectedAccountState, accountProvider: AccountProviderType) =>
        addDatapointConfig(
            {
                name: 'connectedAccountIsInErrorState',
                customData: {
                    accountState_1: OWAConnectedAccountState[accountState],
                    accountProvider_2: accountProvider,
                },
            },
            {
                accountState,
            }
        )
);

/**
 * Announces that the getConnectedAccounts API has returned with a response
 * @param isSuccess to be true if all of the connected accounts returned from the server
 */
export const connectedAccountsListRequested = action(
    'connectedAccountsListRequested',
    (isSuccess: boolean) => ({ isSuccess })
);

export const setAccountsStoreState = action(
    'setAccountsStoreState',
    (state: AccountsStoreState) => ({ state })
);
