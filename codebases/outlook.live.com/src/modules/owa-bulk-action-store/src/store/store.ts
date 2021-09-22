import type BulkActionStateStore from '../store/schema/BulkActionStateStore';
import { createStore } from 'satcheljs';
import { ObservableMap } from 'mobx';

const initialStore: BulkActionStateStore = {
    bulkActionInformationMap: new ObservableMap(),
};

export const getStore = createStore<BulkActionStateStore>('bulkActionStore', initialStore);
const bulkActionStore = getStore();
export default bulkActionStore;
