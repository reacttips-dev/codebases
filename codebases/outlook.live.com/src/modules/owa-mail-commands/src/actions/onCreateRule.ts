import { listViewStore } from 'owa-mail-list-store';
import type { InboxRuleActionSource } from 'owa-inbox-rules-option';
import { lazyCreateRuleFromRow } from 'owa-mail-inbox-rules';

export default async function onCreateRule(
    actionSource: InboxRuleActionSource,
    targetWindow?: Window
) {
    const tableViewId = listViewStore.selectedTableViewId;
    const tableView = listViewStore.tableViews.get(tableViewId)!;
    const rowKeys = [...tableView.selectedRowKeys.keys()];

    const createRuleFromRow = await lazyCreateRuleFromRow.import();
    createRuleFromRow(rowKeys[0], tableView.id, actionSource, targetWindow);
}
