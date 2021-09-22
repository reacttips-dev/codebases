import { listViewStore } from 'owa-mail-list-store';
import type { OwaDate } from 'owa-datetime';
import { lazyScheduleRows } from 'owa-mail-triage-action';
import type { ActionSource } from 'owa-analytics-types';

export default async function onSnooze(date: OwaDate | undefined, actionSource: ActionSource) {
    const tableViewId = listViewStore.selectedTableViewId;
    const tableView = listViewStore.tableViews.get(tableViewId);
    const rowKeys = [...tableView.selectedRowKeys.keys()];
    if (tableView && rowKeys) {
        const scheduleRows = await lazyScheduleRows.import();
        scheduleRows(rowKeys, tableView.id, actionSource, date);
    }
}
