import getStore from './store/store';
import {
    OWAConnectedAccount,
    AccountProviderType,
    OWAConnectedAccountState,
} from './store/schema/OWAConnectedAccount';
import type { AccountsStoreState } from './store/schema/AccountsStoreState';
import { assertNever } from 'owa-assert';
import { isConnectedAccount } from './utils/isConnectedAccount';

export function getOWAConnectedAccounts(): OWAConnectedAccount[] {
    return [...getStore().accountsMap.values()];
}

export function getOWAConnectedAccount(userIdentity: string): OWAConnectedAccount {
    return getStore().accountsMap.get(userIdentity);
}

export function getDefaultConnectedAccount(): OWAConnectedAccount {
    return getOWAConnectedAccounts()?.length > 0 ? getOWAConnectedAccounts()[0] : null;
}

export function getAccountsInErrorState(): OWAConnectedAccount[] {
    return getOWAConnectedAccounts().filter(
        account => account.accountState != OWAConnectedAccountState.Valid
    );
}

export function getAccountsInState(
    accountStates: OWAConnectedAccountState[]
): OWAConnectedAccount[] {
    return getOWAConnectedAccounts().filter(account =>
        accountStates.includes(account.accountState)
    );
}

export function getOWAConnectedAccountsForProvider(
    accountProviderType: AccountProviderType
): OWAConnectedAccount[] {
    return getOWAConnectedAccounts().filter(a => a.accountProviderType == accountProviderType);
}

/**
 * Gets the AccountProviderType for an account.
 * Returns the AccountProviderType if the account is a connected account, otherwise returns null
 * @param userIdentity account address
 */
export function getOWAAccountProvider(userIdentity: string): AccountProviderType | null {
    return isConnectedAccount(userIdentity)
        ? getOWAConnectedAccount(userIdentity).accountProviderType
        : null;
}

export function getOWAConnectedAccountTokenString(account: OWAConnectedAccount): string {
    if (account.accountProviderType == 'Outlook') {
        return `MSAuth1.0 usertoken="${account.token}", type="MSACT"`;
    } else if (account.accountProviderType == 'Google' || account.accountProviderType == 'ICloud') {
        return `Bearer ${account.token}`;
    } else {
        return assertNever(account.accountProviderType);
    }
}

function getPropFromOWAConnectedAccount<K extends keyof OWAConnectedAccount>(
    propertyName: K,
    defaultValue: OWAConnectedAccount[K]
) {
    return function (userIdentity: string) {
        const connectedAccount = getOWAConnectedAccount(userIdentity);
        return connectedAccount ? connectedAccount[propertyName] : defaultValue;
    };
}

export const getOWAConnectedAccountUniqueId = getPropFromOWAConnectedAccount(
    'accountUniqueId',
    '0'
);

export const getOWAConnectedAccountStatus = getPropFromOWAConnectedAccount(
    'accountState',
    OWAConnectedAccountState.Valid
);

export const hasInvalidConnectedAccount = () =>
    getOWAConnectedAccounts().some(account => !isOWAConnectedAccountValid(account.userIdentity));

const getOWAConnectedAccountProviderType = getPropFromOWAConnectedAccount(
    'accountProviderType',
    null
);
export const isOutlookConsumerAccount = (userIdentity: string) =>
    getOWAConnectedAccountProviderType(userIdentity) == 'Outlook';

export const isOWAConnectedAccountValid = (userIdentity: string) =>
    getOWAConnectedAccountStatus(userIdentity) == OWAConnectedAccountState.Valid;

export const hasConnectedAccounts = (): boolean => getOWAConnectedAccounts().length > 0;

export function getAccountsStoreState(): AccountsStoreState {
    return getStore().accountsLoadedState;
}
