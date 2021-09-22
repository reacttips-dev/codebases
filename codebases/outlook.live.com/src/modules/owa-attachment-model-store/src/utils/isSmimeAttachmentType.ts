import type SmimeAttachmentType from '../store/schema/SmimeAttachmentType';
import type AttachmentType from 'owa-service/lib/contract/AttachmentType';

/**
 * Determines whether an attachment belongs to smime attachment type or not
 * @param attachment the attachment object
 */
export default function isSmimeAttachmentType(
    attachment: AttachmentType
): attachment is SmimeAttachmentType {
    return attachment?.AttachmentId && isSmimeAttachment(attachment.AttachmentId.Id);
}

export function isSmimeAttachment(id: string): boolean {
    return id && id.indexOf('smime-') !== -1;
}
