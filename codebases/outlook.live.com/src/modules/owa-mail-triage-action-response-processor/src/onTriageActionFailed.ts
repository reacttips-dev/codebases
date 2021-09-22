import reloadTableOnTriageActionFail from 'owa-mail-actions/lib/table-loading/reloadTableOnTriageActionFail';
import type { TableView } from 'owa-mail-list-store';

/**
 * Reload table upon triage action failure
 * This is done to avoid infinite loading bug, which occurs if triage action fails
 * @param tableView the tableView param
 */
export default function onTriageActionFailed(tableView: TableView) {
    // VSO: 43747 - Can we add better checks to determine if we are in fileshub rather than check tableView is null
    if (!tableView) {
        return;
    }

    reloadTableOnTriageActionFail(tableView);
}
