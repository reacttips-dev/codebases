import type { TableView } from 'owa-mail-list-store';
import { action } from 'satcheljs';

export default action('RELOAD_TABLE_ON_TRIAGE_ACTION_FAIL', (tableView: TableView) => {
    return {
        tableView,
    };
});
