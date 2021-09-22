import ChatSignInState from './schema/ChatSignInState';
import type PresenceStore from './schema/PresenceStore';
import { ObservableMap } from 'mobx';
import { createStore } from 'satcheljs';

const initialPresenceStore: PresenceStore = {
    signInState: ChatSignInState.Unknown,
    presences: new ObservableMap({}),
    processingManualSignIn: false,
    isRetrySignInAllowed: true,
};

export let getStore = createStore<PresenceStore>('presenceStore', initialPresenceStore);
const store = getStore();
export default store;
