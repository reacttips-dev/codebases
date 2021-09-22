import { createStore } from 'satcheljs';
import type MailVotingStore from './schema/MailVotingStore';
import { defaultProviderName } from './schema/MailVotingTypes';

const initialMailVotingStore: MailVotingStore = {
    options: undefined,
    activeProviders: [defaultProviderName],
    referenceItemId: undefined,
    results: undefined,
};

export const getStore = createStore<MailVotingStore>('mailVotingStore', initialMailVotingStore);

const store = getStore();
export default store;
