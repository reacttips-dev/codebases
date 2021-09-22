import type MarkReadStore from './schema/MarkReadStore';
import { createStore } from 'satcheljs';

const initialMarkReadStore: MarkReadStore = {
    markAsReadTimerTask: null,
    suppressedItemIdsMap: {},
};

const markReadStore = createStore<MarkReadStore>('markread', initialMarkReadStore)();
export default markReadStore;
