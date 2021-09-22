import type PopoutParentStore from './schema/PopoutParentStore';
import { createStore } from 'satcheljs';

// This doesn't need to be a mobx store for now since no react component rely on it
let parentStoreData: PopoutParentStore = {
    projections: [],
    isAvailable: false,
};

export const getStore = createStore<PopoutParentStore>('popoutParent', parentStoreData);

const parentStore = getStore();
export default parentStore;
