import { action } from 'satcheljs/lib/legacy';
import listViewStore from 'owa-mail-list-store/lib/store/Store';

/**
 * Removes the attachment well and the attachment view states for given row
 * @param rowId for which the attachment view state are to be cleared
 */
export default action('removeAttachmentPreviewsForRow')(function removeAttachmentPreviewsForRow(
    rowId: string
): void {
    const attachmentPreviewWellViews = listViewStore.rowAttachmentPreviewWellViews;
    const attachmentPreviewWellView = attachmentPreviewWellViews.get(rowId);

    if (!attachmentPreviewWellView) {
        return;
    }

    const attachmentViewStates = listViewStore.attachmentViewStates;

    // Clear all image attachment view states
    attachmentPreviewWellView.imageViewStateIds.forEach(imageAttachmentViewStateKey => {
        attachmentViewStates.delete(imageAttachmentViewStateKey);
    });

    // Clear all document attachment view states
    attachmentPreviewWellView.documentViewStateIds.forEach(docAttachmentViewStateKey => {
        attachmentViewStates.delete(docAttachmentViewStateKey);
    });

    // Delete the attachment well view state
    attachmentPreviewWellViews.delete(rowId);
});
