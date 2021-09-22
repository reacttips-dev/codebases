import type SkypeStore from './schema/SkypeStore';
import { createStore } from 'satcheljs';

var initialSkypeStore: SkypeStore = {
    unreadConversationCount: 0,
    isRecentsInitialized: false,
    isSwcInitialized: false,
    isGlimpseOpen: false,
};
var store = createStore<SkypeStore>('SkypeStore', initialSkypeStore)();

export default store;
