import { getExtensionFromFileName } from 'owa-file';
import type AttachmentType from 'owa-service/lib/contract/AttachmentType';

const emailFileExtensions: string[] = ['.eml', '.msg'];

export default function shouldPreviewEmailAttachment(attachment: AttachmentType): boolean {
    const fileExtension = getExtensionFromFileName(attachment.Name);
    return !!fileExtension && emailFileExtensions.indexOf(fileExtension.toLowerCase()) >= 0;
}
