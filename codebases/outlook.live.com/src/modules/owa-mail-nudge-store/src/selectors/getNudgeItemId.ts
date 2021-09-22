import nudgeStore from '../store/Store';

export function getNudgeItemId(rowKey: string): string {
    const nudgedRows = nudgeStore.nudgedRows.filter(nudgedRow => nudgedRow.rowKey === rowKey);

    if (nudgedRows.length > 0) {
        return nudgedRows[0].itemId;
    }

    return null;
}
