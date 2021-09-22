import type * as Schema from 'owa-graph-schema';
import type AttachmentType from 'owa-service/lib/contract/AttachmentType';
import type LinkAttachment from 'owa-service/lib/contract/LinkAttachment';
import { LINK_ATTACHMENT_TYPE } from 'owa-attachment-constants/lib/attachmentTypes';

export function isAttachmentOfLinkType(attachment: AttachmentType): attachment is LinkAttachment {
    return (
        (attachment.__type || (attachment as Schema.Attachment).OwsTypeName) ===
        LINK_ATTACHMENT_TYPE
    );
}
