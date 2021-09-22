import type AttachmentPreview from 'owa-service/lib/contract/AttachmentPreview';

/**
 * Dedups the inline previews in the given set of attachment previews
 * @param originalPreviews Attachment previews received from server
 * @return deduped list of the previews
 */
export default function getDedupedInlinePreviews(
    originalPreviews: AttachmentPreview[]
): AttachmentPreview[] {
    const dedupedPreviews: AttachmentPreview[] = [];

    for (let i = 0, len = originalPreviews.length; i < len; i++) {
        const previewToAdd = originalPreviews[i];
        const previewAttachment = previewToAdd.Attachment;
        let findIndex = -1;

        // Try deduping only inline previews
        if (!!previewAttachment.IsInline) {
            // Find an inline preview with same name and belonging to different item in the dedupedPreviews array
            for (let i = 0; i < dedupedPreviews.length; i++) {
                const preview = dedupedPreviews[i];
                if (
                    !!preview.Attachment.IsInline &&
                    preview.Attachment.Name == previewAttachment.Name &&
                    preview.ParentItemId.Id != previewToAdd.ParentItemId.Id
                ) {
                    findIndex = i;
                    break;
                }
            }
        }

        // Add preview to the deduped previews list if a matching preview was not found
        if (findIndex == -1) {
            dedupedPreviews.push(previewToAdd);
        }
    }

    return dedupedPreviews;
}
