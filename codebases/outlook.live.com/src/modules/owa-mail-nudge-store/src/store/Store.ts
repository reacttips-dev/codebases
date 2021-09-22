import { createStore } from 'satcheljs';
import type NudgeStore from './schema/NudgeStore';

const nudgeStore: NudgeStore = {
    nudgedRows: [],
};

export let getStore = createStore<NudgeStore>('nudgeStore', nudgeStore);

const store = getStore();
export default store;
