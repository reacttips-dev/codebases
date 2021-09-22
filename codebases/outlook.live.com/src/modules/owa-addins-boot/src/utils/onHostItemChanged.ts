import OnHostItemChangedStatus from '../schema/OnHostItemChangedStatus';
import { closeNonPersistentTaskPaneAddinCommand } from 'owa-addins-view';

export default function onHostItemChanged(
    hostItemIndex: string,
    selectionStatus: OnHostItemChangedStatus
) {
    if (selectionStatus == OnHostItemChangedStatus.Deselected) {
        closeNonPersistentTaskPaneAddinCommand(hostItemIndex);
    }
}
