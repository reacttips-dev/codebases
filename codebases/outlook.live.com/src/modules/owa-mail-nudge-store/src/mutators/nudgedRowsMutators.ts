import { onNudgeRemoved } from '../actions/onNudgeRemoved';
import { onGetNudgesCompleted } from '../actions/onGetNudgesCompleted';
import nudgeStore from '../store/Store';
import { mutator } from 'satcheljs';

mutator(onGetNudgesCompleted, actionMessage => {
    nudgeStore.nudgedRows = actionMessage.nudgedRows;
});

mutator(onNudgeRemoved, actionMessage => {
    for (let i = nudgeStore.nudgedRows.length - 1; i >= 0; i--) {
        if (nudgeStore.nudgedRows[i].rowKey === actionMessage.rowKey) {
            nudgeStore.nudgedRows.splice(i, 1);
        }
    }
});
