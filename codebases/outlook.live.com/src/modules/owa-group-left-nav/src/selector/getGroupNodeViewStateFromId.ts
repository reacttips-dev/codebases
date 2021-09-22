import { getLeftNavGroupsStore } from '../store/store';
import type GroupNodeViewState from '../store/schema/GroupNodeViewState';
import createDragViewState from 'owa-dnd/lib/utils/createDragViewState';
import createDropViewState from 'owa-dnd/lib/utils/createDropViewState';
import setGroupNodeViewStateMutator from '../mutators/setGroupNodeViewStateMutator';

/**
 * Returns the groupNodeViewState given a groupId
 * @param groupdId the smtp address of the group whose nodeViewState will be returned
 */
export default function getGroupNodeViewStateFromId(groupId: string): GroupNodeViewState {
    if (!getLeftNavGroupsStore().groupNodeViewStates.has(groupId)) {
        setGroupNodeViewStateMutator(groupId, {
            drag: createDragViewState(),
            drop: createDropViewState(),
            isDroppingMessage: false,
        });
    }

    return getLeftNavGroupsStore().groupNodeViewStates.get(groupId);
}
