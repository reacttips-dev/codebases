import type LeftNavGroupsSchema from './schema/LeftNavGroups';
import { createStore } from 'satcheljs';
import type GroupNodeViewState from './schema/GroupNodeViewState';
import { ObservableMap } from 'mobx';

const defaultLeftNavGroupsStore: LeftNavGroupsSchema = {
    myOrgGroups: [],
    withContextMenuGroup: null,
    shouldShowAllGroups: false,
    hasLoadedFromServer: false,
    loadGroupsError: false,
    groupNodeViewStates: new ObservableMap<string, GroupNodeViewState>({}),
};

export let getLeftNavGroupsStore = createStore<LeftNavGroupsSchema>(
    'leftNavGroupsStore',
    defaultLeftNavGroupsStore
);

const leftNavGroupsStore = getLeftNavGroupsStore();
export default leftNavGroupsStore;
