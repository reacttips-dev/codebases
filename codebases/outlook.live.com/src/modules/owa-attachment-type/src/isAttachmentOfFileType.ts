import type * as Schema from 'owa-graph-schema';
import type AttachmentType from 'owa-service/lib/contract/AttachmentType';
import type FileAttachment from 'owa-service/lib/contract/FileAttachment';
import { FILE_ATTACHMENT_TYPE } from 'owa-attachment-constants/lib/attachmentTypes';

export function isAttachmentOfFileType(attachment: AttachmentType): attachment is FileAttachment {
    return (
        (attachment.__type || (attachment as Schema.Attachment).OwsTypeName) ===
        FILE_ATTACHMENT_TYPE
    );
}
