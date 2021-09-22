import { AttachmentFileType, AttachmentFileAttributes } from 'owa-attachment-file-types';

export default function hasInlineImage(attachments: AttachmentFileAttributes[]): boolean {
    return attachments?.some(
        attachment => attachment.file.fileType == AttachmentFileType.Uri && attachment.isInline
    );
}
