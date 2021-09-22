import type PermissionCheckerStore from './schema/PermissionCheckerStore';
import { ObservableMap } from 'mobx';
import { createStore } from 'satcheljs';

const permissionCheckerStore: PermissionCheckerStore = {
    permissionCheckers: new ObservableMap({}),
};

export const getStore = createStore<PermissionCheckerStore>(
    'permissionCheckerStore',
    permissionCheckerStore
);
export default getStore;
