import type TrustedSendersStore from './schema/TrustedSendersStore';
import { createStore } from 'satcheljs';

const initialTrustedSendersStore: TrustedSendersStore = {
    trustedSendersAndDomains: null,
};
const store = createStore<TrustedSendersStore>('TrustedSenders', initialTrustedSendersStore)();

export default store;
