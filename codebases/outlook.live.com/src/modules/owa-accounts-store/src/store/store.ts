import type { OWAConnectedAccount } from './schema/OWAConnectedAccount';
import { createStore } from 'satcheljs';
import { ObservableMap } from 'mobx';
import { AccountsStoreState } from './schema/AccountsStoreState';

export default createStore('OWAAccountsStore', {
    accountsMap: new ObservableMap<string, OWAConnectedAccount>({}),
    accountsLoadedState: AccountsStoreState.None,
});
