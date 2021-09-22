import type * as Schema from 'owa-graph-schema';
import type AttachmentType from 'owa-service/lib/contract/AttachmentType';
import type ItemAttachment from 'owa-service/lib/contract/ItemAttachment';
import { ITEM_ATTACHMENT_TYPE } from 'owa-attachment-constants/lib/attachmentTypes';

// This is generic because S/MIME uses extended Attachment Types.
// (e.g. AttachmentType & {extra: ..., smime: ..., fields: ...})
//
// If this utility was not generic, it would narrow
// to ItemAttachment, dropping those extra fields
export function isAttachmentOfItemType<T extends AttachmentType>(
    attachment: T
): attachment is T & ItemAttachment {
    return (
        (attachment.__type || (attachment as Schema.Attachment).OwsTypeName) ===
        ITEM_ATTACHMENT_TYPE
    );
}
