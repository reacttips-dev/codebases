import { getLeftNavGroupsStore } from '../store/store';
import { mutatorAction } from 'satcheljs';

export default mutatorAction(
    'setGroupDragDropActionState',
    function setGroupDragDropActionState(groupId: string, isDroppingMessage: boolean) {
        getLeftNavGroupsStore().groupNodeViewStates.get(
            groupId
        ).isDroppingMessage = isDroppingMessage;
    }
);
