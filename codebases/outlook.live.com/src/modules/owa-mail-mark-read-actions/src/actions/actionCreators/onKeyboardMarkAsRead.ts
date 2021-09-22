import { action } from 'satcheljs';
import type { TableView } from 'owa-mail-list-store';

export default action(
    'onKeyboardMarkAsRead',
    (
        tableView: TableView,
        selectedNodeIds: string[],
        isInVirtualSelectAllMode: boolean,
        rowKeysToActOn: string[],
        exclusionList: string[],
        isReadValueToSet: boolean
    ) => ({
        tableView,
        selectedNodeIds,
        isInVirtualSelectAllMode,
        rowKeysToActOn,
        exclusionList,
        isReadValueToSet,
    })
);
