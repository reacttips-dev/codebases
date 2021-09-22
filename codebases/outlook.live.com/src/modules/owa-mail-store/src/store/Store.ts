import type ConversationItemParts from './schema/ConversationItemParts';
import type ConversationReadingPaneNode from './schema/ConversationReadingPaneNode';
import type MailStore from './schema/MailStore';
import { ObservableMap } from 'mobx';
import { createStore } from 'satcheljs';

const mailStoreData: MailStore = {
    conversationNodes: new ObservableMap<string, ConversationReadingPaneNode>({}),
    conversations: new ObservableMap<string, ConversationItemParts>({}),
    items: new ObservableMap({}),
    searchFolderDisplayName: null,
    typeOfItemBeingDragged: null,
    triageAnnouncement: {
        message: null,
        politenessSetting: 'off',
    },
};

export let getStore = createStore<MailStore>('mail', mailStoreData);
const store = getStore();
export default store;
