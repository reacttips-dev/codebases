import { action } from 'satcheljs';
import type NudgedRow from '../store/schema/NudgedRow';
import type { TableView } from 'owa-mail-list-store';

export const onGetNudgesCompleted = action(
    'ON_GET_NUDGES_COMPLETED',
    (nudgedRows: NudgedRow[], tableView: TableView) => ({
        nudgedRows,
        tableView,
    })
);
