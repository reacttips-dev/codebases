import { createLazyOrchestrator } from 'owa-bundling';
import reloadTableOnTriageActionFail from 'owa-mail-actions/lib/table-loading/reloadTableOnTriageActionFail';
import undoWhenNotificationChannelNotReady from 'owa-mail-actions/lib/table-loading/undoWhenNotificationChannelNotReady';
import reloadTable from '../actions/reloadTable';
import { getSelectedTableView, TableView } from 'owa-mail-list-store';

export const reloadTableOnTriageActionFailOrchestrator = createLazyOrchestrator(
    reloadTableOnTriageActionFail,
    'reloadTableOnTriageActionFailClone',
    actionMessage => {
        const { tableView } = actionMessage;
        reloadTableInternal(tableView);
    }
);

export const reloadTableUponUndoWithoutNotificaitonChannel = createLazyOrchestrator(
    undoWhenNotificationChannelNotReady,
    'reloadTableOnTriageActionFailClone',
    actionMessage => {
        reloadTableInternal(getSelectedTableView());
    }
);

function reloadTableInternal(tableView: TableView) {
    // Adding null check to make sure table exists as this is a lazy orchestrator.
    if (!tableView) {
        return;
    }

    reloadTable(tableView);
}
