import { isImageFile } from 'owa-file';
import type AttachmentType from 'owa-service/lib/contract/AttachmentType';
import { isAttachmentOfReferenceType } from 'owa-attachment-type/lib/isAttachmentOfReferenceType';

const imageFileMimeTypes: string[] = ['image/jpeg', 'image/png', 'image/gif', 'image/bmp'];

export default function shouldPreviewImage(attachment: AttachmentType): boolean {
    return (
        isImageFile(attachment.Name) ||
        (!isAttachmentOfReferenceType(attachment) && isImageMimeType(attachment.ContentType))
    );
}

function isImageMimeType(contentType: string): boolean {
    if (contentType) {
        return imageFileMimeTypes.indexOf(contentType.toLowerCase()) >= 0;
    }

    return false;
}
