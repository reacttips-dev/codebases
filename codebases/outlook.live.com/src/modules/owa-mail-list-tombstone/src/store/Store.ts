import type TombstoneStore from './schema/TombstoneStore';
import { createStore } from 'satcheljs';

export let getStore = createStore<TombstoneStore>('tombstone', {
    folderTombstoneMap: {},
});

const tombstoneStore = getStore();

export default tombstoneStore;
