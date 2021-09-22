import { setAccountsStoreState } from '../actions';
import getStore from '../store/store';
import { mutator } from 'satcheljs';

mutator(setAccountsStoreState, actionMessage => {
    getStore().accountsLoadedState = actionMessage.state;
});
