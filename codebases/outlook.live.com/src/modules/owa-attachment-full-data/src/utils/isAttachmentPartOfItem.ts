import type AttachmentType from 'owa-service/lib/contract/AttachmentType';
import type ItemId from 'owa-service/lib/contract/ItemId';

/**
 * Returns true if attachment RootItemId matches itemId
 * This utility makes the following assumptions:
 *      1. CreateAttachmentFromLocalFile API call will always have RootItemId field in AttachmentType object.
 */
export default function isAttachmentPartOfItem(
    attachment: AttachmentType,
    itemId: ItemId
): boolean {
    const attachmentRootId = attachment?.AttachmentId?.RootItemId;
    return attachmentRootId && itemId && attachmentRootId === itemId.Id;
}
