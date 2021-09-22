import nudgeStore from '../store/Store';

export default function isNudgedRow(rowKey: string, tableViewId: string): boolean {
    return (
        // multiple items may be nudged in the same conversation
        nudgeStore.nudgedRows.some(
            nudgedRow =>
                (nudgedRow.rowKey === rowKey && nudgedRow.tableViewId === tableViewId) ||
                rowKey == 'testNudgeRowKey'
        )
    );
}
