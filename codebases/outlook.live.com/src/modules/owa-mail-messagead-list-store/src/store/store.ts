import { createStore } from 'satcheljs';
import type MessageAdListViewStatusStore from './schema/MessageAdListViewStatusStore';

// Import mutators so they are initialized at the same time as the store
import '../mutators/removeMessageAdListMutator';

const initialMessageAdListViewStatusStore: MessageAdListViewStatusStore = {
    selectedAdId: null,
    showAdCount: -1,
};
export const getStore = createStore<MessageAdListViewStatusStore>(
    'messageAdListViewStatusStore',
    initialMessageAdListViewStatusStore
);
const store = getStore();
export default store;
