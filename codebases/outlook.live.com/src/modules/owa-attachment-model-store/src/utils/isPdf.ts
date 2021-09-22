import { getExtensionFromFileName } from 'owa-file';
import type AttachmentType from 'owa-service/lib/contract/AttachmentType';

export default function isPdf(attachment: AttachmentType): boolean {
    const fileExtension = getExtensionFromFileName(attachment.Name);
    return fileExtension && fileExtension.toLowerCase() === '.pdf';
}
