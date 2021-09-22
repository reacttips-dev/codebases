import tombstoneOperations from 'owa-mail-list-tombstone';

/**
 * Rows are removed from the Tombstone regardless of the triage action response
 */
export default function onTriageActionCompleted(
    rowKeys: string[],
    sourceFolderId: string,
    shouldRemoveRowsFromTombstone?: boolean
) {
    if (!!shouldRemoveRowsFromTombstone) {
        tombstoneOperations.removeRowsFromTombstone(rowKeys, sourceFolderId);
    }
}
