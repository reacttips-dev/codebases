import type UcmaStore from './schema/UcmaStore';
import { createStore } from 'satcheljs';
import { ObservableMap } from 'mobx';

const initialChatStore: UcmaStore = {
    chats: [],
    isMoreChatMenuShown: false,
    participantCache: new ObservableMap<string, string>(),
};

export let getStore = createStore<UcmaStore>('ucmaStore', initialChatStore);
const store = getStore();
export default store;
