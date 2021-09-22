import type HotkeysMapStore from './schema/HotkeysMapStore';
import { createStore } from 'satcheljs';

const initialHotkeysMapStore: HotkeysMapStore = {
    isVisible: false,
};

const store = createStore<HotkeysMapStore>('HotkeysMapStore', initialHotkeysMapStore)();

export default store;
