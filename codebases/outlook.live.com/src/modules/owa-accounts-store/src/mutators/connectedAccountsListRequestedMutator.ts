import { connectedAccountsListRequested } from '../actions';
import { mutator } from 'satcheljs';
import getStore from '../store/store';
import { AccountsStoreState } from '../store/schema/AccountsStoreState';

/**
 * This mutator is triggered from owa-account-store-init
 */
mutator(connectedAccountsListRequested, actionMessage => {
    const newLoadState = actionMessage.isSuccess
        ? AccountsStoreState.AccountsLoadSuccessful
        : AccountsStoreState.AccountsLoadError;
    getStore().accountsLoadedState = newLoadState;
});
