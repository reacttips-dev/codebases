import ChatProvider from './schema/ChatProvider';
import type ChatStore from './schema/ChatStore';
import { createStore } from 'satcheljs';

const initialChatStore: ChatStore = {
    isChatCalloutShown: false,
    chatProvider: ChatProvider.Unknown,
};

export let getStore = createStore<ChatStore>('chatStore', initialChatStore);
const store = getStore();
export default store;
