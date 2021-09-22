import nudgeStore from '../store/Store';
import type NudgedRow from '../store/schema/NudgedRow';
import {
    MailRowDataPropertyGetter,
    getStore as getListViewStore,
    getSelectedTableViewId,
} from 'owa-mail-list-store';
import { doesRowBelongToNudgeSection } from './doesRowBelongToNudgeSection';

export function getNudgedRowKeyFromConversationId(conversationId: string): string {
    // multiple items may be nudged in the same conversation
    const nudgedRows = nudgeStore.nudgedRows.filter(
        nudgedRow => nudgedRow.conversationId === conversationId
    );

    if (nudgedRows.length > 0 && isRowShownAsNudge(nudgedRows[0])) {
        return nudgedRows[0].rowKey;
    }

    return null;
}

export function getNudgedRowKeyFromItemId(itemId: string): string {
    const nudgedRows = nudgeStore.nudgedRows.filter(nudgedRow => nudgedRow.itemId === itemId);

    if (nudgedRows.length > 0 && isRowShownAsNudge(nudgedRows[0])) {
        return nudgedRows[0].rowKey;
    }

    return null;
}

function isRowShownAsNudge(nudgedRow: NudgedRow) {
    const tableViewId = nudgedRow.tableViewId;
    const tableView = getListViewStore().tableViews.get(tableViewId);

    // If tableview does not exist, the row is not shown as nudge
    if (!tableView || tableView.id != getSelectedTableViewId()) {
        return false;
    }

    const rowKey = nudgedRow.rowKey;
    return doesRowBelongToNudgeSection(
        rowKey,
        tableViewId,
        MailRowDataPropertyGetter.getLastDeliveryOrRenewTimeStamp(rowKey, tableView)
    );
}
