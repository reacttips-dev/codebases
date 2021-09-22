import type UcwaStore from './schema/UcwaStore';
import { createStore } from 'satcheljs';

const initialChatStore: UcwaStore = {
    unreadCount: 0,
};

export let getStore = createStore<UcwaStore>('ucwaStore', initialChatStore);
const store = getStore();
export default store;
