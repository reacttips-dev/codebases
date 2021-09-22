import { action } from 'satcheljs';
import type { TableView } from 'owa-mail-list-store';

export const onMergeRowResponseFromTopInTableComplete = action(
    'ON_MERGE_ROW_COMPLETED',
    (tableView: TableView) => ({
        tableView,
    })
);
