import { createStore } from 'satcheljs';
import type RecipientCommonStore from './schema/RecipientCommonStore';

var initialRecipientCommonStore: RecipientCommonStore = {
    fallbackToFindPeople: false,
};
var store = createStore<RecipientCommonStore>('recipientcommon', initialRecipientCommonStore)();

export default store;
