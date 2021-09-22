import type AttachmentType from 'owa-service/lib/contract/AttachmentType';
import type LinkAttachment from 'owa-service/lib/contract/LinkAttachment';
import type ReferenceAttachment from 'owa-service/lib/contract/ReferenceAttachment';

export default function tryGetAttachmentUrl(attachment: AttachmentType): string | null {
    let attachmentUrl = null;
    attachmentUrl = (attachment as ReferenceAttachment).AttachLongPathName;
    if (!attachmentUrl) {
        attachmentUrl = (attachment as LinkAttachment).WebUrl;
    }
    return attachmentUrl;
}
