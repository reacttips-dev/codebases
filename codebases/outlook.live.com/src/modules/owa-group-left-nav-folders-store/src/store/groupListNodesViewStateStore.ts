import { createStore } from 'satcheljs';
import { ObservableMap } from 'mobx';
import type { GroupFolderTreeViewState } from './schema/GroupFolderTreeViewState';
import type { GroupListNodesViewStateStore } from './schema/GroupListNodesViewStateStore';

const initialGroupListNodesViewStateStore: GroupListNodesViewStateStore = {
    groupListNodesViewStates: new ObservableMap<string, GroupFolderTreeViewState>({}),
};

const groupListNodesViewStateStore = createStore<GroupListNodesViewStateStore>(
    'groupListNodesViewState',
    initialGroupListNodesViewStateStore
)();

export default groupListNodesViewStateStore;
