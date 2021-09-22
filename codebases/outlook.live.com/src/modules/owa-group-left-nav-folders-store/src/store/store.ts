import { createStore } from 'satcheljs';
import { ObservableMap } from 'mobx';
import type { GroupFolderHierarchy } from './schema/GroupFolderHierarchy';
import type { GroupFoldersStore } from './schema/GroupFoldersStore';

const defaultLeftNavGroupFoldersStore: GroupFoldersStore = {
    folderTable: new ObservableMap<string, GroupFolderHierarchy>({}),
};

const leftNavGroupFoldersStore = createStore<GroupFoldersStore>(
    'leftNavGroupFoldersStore',
    defaultLeftNavGroupFoldersStore
)();

export default leftNavGroupFoldersStore;
