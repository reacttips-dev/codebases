import { createStore } from 'satcheljs';
import type StorageStore from './schema/StorageStore';

const storageStoreDefaultState: StorageStore = {
    usagePercentage: 0,
    amountUsed: 0,
    usageInBytes: 0,
    sendReceiveQuota: { IsUnlimited: false, Value: 0 },
    hasOpenedStoragePageOnFull: false,
};

const getStore = createStore<StorageStore>('storageStore', storageStoreDefaultState);

export default getStore;
