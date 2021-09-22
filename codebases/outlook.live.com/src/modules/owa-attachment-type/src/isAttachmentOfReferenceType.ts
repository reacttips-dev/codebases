import type * as Schema from 'owa-graph-schema';
import type AttachmentType from 'owa-service/lib/contract/AttachmentType';
import type ReferenceAttachment from 'owa-service/lib/contract/ReferenceAttachment';
import { REFERENCE_ATTACHMENT_TYPE } from 'owa-attachment-constants/lib/attachmentTypes';

export function isAttachmentOfReferenceType(
    attachment: AttachmentType
): attachment is ReferenceAttachment {
    return (
        (attachment.__type || (attachment as Schema.Attachment).OwsTypeName) ===
        REFERENCE_ATTACHMENT_TYPE
    );
}
