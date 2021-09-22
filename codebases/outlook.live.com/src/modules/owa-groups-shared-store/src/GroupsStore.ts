import { createStore } from 'satcheljs';
import type GroupsState from './schema/GroupsState';
import type GroupInformation from './schema/GroupInformation';
import { ObservableMap } from 'mobx';

export const getGroupsStore = createStore<GroupsState>('groupsStore', {
    groups: new ObservableMap<string, GroupInformation>(),
});
