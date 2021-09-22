import onKeyboardMarkAsRead from '../actions/actionCreators/onKeyboardMarkAsRead';
import { orchestrator } from 'satcheljs';
import markItemsAsReadBasedOnNodeIds from '../actions/actionCreators/markItemsAsReadBasedOnNodeIds';
import markAsReadInTable from '../actions/triage/markAsReadInTable';

export default orchestrator(onKeyboardMarkAsRead, actionMessage => {
    const {
        tableView,
        selectedNodeIds,
        isInVirtualSelectAllMode,
        rowKeysToActOn,
        exclusionList,
        isReadValueToSet,
    } = actionMessage;

    if (selectedNodeIds.length > 0) {
        markItemsAsReadBasedOnNodeIds(
            selectedNodeIds,
            tableView.id,
            isReadValueToSet,
            true /* isExplicit */,
            'Keyboard'
        );
    } else {
        markAsReadInTable(
            'Keyboard',
            exclusionList,
            isInVirtualSelectAllMode /* isActingOnAllItemsInTable */,
            isReadValueToSet,
            rowKeysToActOn,
            tableView
        );
    }
});
