import { createStore } from 'satcheljs';
import type RecipientCacheStore from './schema/RecipientCacheStore';

var initialRecipientCacheStore: RecipientCacheStore = {
    recipientCache: null,
    allKeys: {},
    usedFindPeopleFallback: false,
    userIdentity: '',
};
var store = createStore<RecipientCacheStore>('recipientcache', initialRecipientCacheStore)();

export default store;
