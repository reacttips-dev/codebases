import type GroupNodeViewState from '../store/schema/GroupNodeViewState';
import { getLeftNavGroupsStore } from '../store/store';
import { mutatorAction } from 'satcheljs';

export default mutatorAction(
    'setGroupNodeViewStateMutator',
    function setGroupNodeViewStateMutator(groupId: string, viewState: GroupNodeViewState) {
        getLeftNavGroupsStore().groupNodeViewStates.set(groupId, viewState);
    }
);
