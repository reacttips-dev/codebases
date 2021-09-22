import { orchestrator } from 'satcheljs';
import {
    onGetNudgesCompleted,
    getStore,
    doesRowBelongToNudgeSection,
    NudgedRow,
} from 'owa-mail-nudge-store';
import { MailRowDataPropertyGetter, TableView } from 'owa-mail-list-store';
import TableOperations from 'owa-mail-list-table-operations';
import {
    getFirstUnpinnedRowIndex,
    onMergeRowResponseFromTopInTableComplete,
} from 'owa-mail-list-response-processor';
import { logUsage } from 'owa-analytics';
import { trace } from 'owa-trace';

// Insert nudges to nudge section upon GetNudge call completed
orchestrator(onGetNudgesCompleted, actionMessage => {
    const nudges = actionMessage.nudgedRows;
    nudges.forEach(nudgedRow =>
        insertNudgesInNudgeSection(nudgedRow, actionMessage.tableView, 'onGetNudge')
    );
});

// Insert nudges to nudge section upon merging the response.
orchestrator(onMergeRowResponseFromTopInTableComplete, actionMessage => {
    const allNudges = getStore().nudgedRows;
    const tableView = actionMessage.tableView;
    const nudgesForTable = allNudges.filter(nudge => nudge.tableViewId == tableView.id);
    nudgesForTable.forEach(nudgedRow =>
        insertNudgesInNudgeSection(nudgedRow, actionMessage.tableView, 'onMerge')
    );
});

/**
 * Moves nudge rows in the table to nudge section if necessary
 * @param nudgedRow nudged row
 * @param tableView tableView where the move needs to be done
 * @param scenario scenario which led to the insertion of the nudges
 */
function insertNudgesInNudgeSection(nudgedRow: NudgedRow, tableView: TableView, scenario: string) {
    // Only insert nudges that belong to the tableView
    if (nudgedRow.tableViewId != tableView.id) {
        return;
    }

    let indexToInsertAt;
    let nudgeRenderDatapoint = 'Nudge_Render';
    const { rowKey, conversationId, itemId } = nudgedRow;

    // Insert nudge row to nudge section if it belongs to nudge section
    if (
        doesRowBelongToNudgeSection(
            rowKey,
            tableView.id,
            MailRowDataPropertyGetter.getLastDeliveryOrRenewTimeStamp(rowKey, tableView)
        )
    ) {
        indexToInsertAt = getFirstUnpinnedRowIndex(tableView, 0 /*startIndex*/);
        TableOperations.updateRowPosition(indexToInsertAt, rowKey, tableView);
        trace.info(
            'Nudge: ' +
                scenario +
                ' updateNudgedRowPosition - row is inserted at ' +
                indexToInsertAt
        );
    } else {
        nudgeRenderDatapoint = 'Nudge_NotRender';
        trace.info('Nudge: ' + scenario + ' updateNudgedRowPosition - row is pinned');
    }

    logUsage(
        nudgeRenderDatapoint,
        {
            owa_1: scenario,
            rKey: rowKey,
            iId: itemId,
            cId: conversationId,
            index: indexToInsertAt,
        },
        {
            isCore: true,
        }
    );
}
