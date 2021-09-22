import type * as Schema from 'owa-graph-schema';
import type AttachmentType from 'owa-service/lib/contract/AttachmentType';
import type ItemIdAttachment from 'owa-service/lib/contract/ItemIdAttachment';
import { ITEM_ID_ATTACHMENT_TYPE } from 'owa-attachment-constants/lib/attachmentTypes';

export function isAttachmentOfItemIdType(
    attachment: AttachmentType
): attachment is ItemIdAttachment {
    return (
        (attachment.__type || (attachment as Schema.Attachment).OwsTypeName) ===
        ITEM_ID_ATTACHMENT_TYPE
    );
}
