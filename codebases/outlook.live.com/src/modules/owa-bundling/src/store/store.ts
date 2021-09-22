import type BundlingStore from './schema/BundlingStore';
import { createStore } from 'satcheljs';
import { ObservableMap } from 'mobx';

const initialBundlingStore: BundlingStore = {
    loadedImports: new ObservableMap<string, boolean>(),
};

const store = createStore('bundlingStore', initialBundlingStore)();
export default store;
