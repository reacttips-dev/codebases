import { createStore } from 'satcheljs';
import type LeftRailStore from './schema/LeftRailStore';

const defaultStore: LeftRailStore = {
    selectedApp: null,
    enabledRailItems: [],
};
export let getStore = createStore<LeftRailStore>('leftRailStore', defaultStore);

const store = getStore();
export default store;
