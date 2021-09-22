import reloadTable from './reloadTable';
import { getDefaultInboxTableView } from 'owa-mail-triage-table-utils/lib/getDefaultInboxTableView';

export default function reloadInboxPostBoot() {
    // Reload Inbox folder after 3 seconds after boot, so that we cover the gap between when SessionData was fetched
    // and when our notification channel gets established.
    setTimeout(() => {
        // The default Inbox table view
        const tableView = getDefaultInboxTableView();
        reloadTable(tableView);
    }, 3000);
}
