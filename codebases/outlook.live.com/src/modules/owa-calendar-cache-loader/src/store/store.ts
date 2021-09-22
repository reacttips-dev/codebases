import type { CacheLoaderStore } from './schema/CacheLoaderStore';
import { createStore } from 'satcheljs';

let getStore = createStore<CacheLoaderStore>('cacheLoaderStore', {
    loadedCalendarAccounts: [],
});

export default getStore;
