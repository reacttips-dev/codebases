import { getExtensionWithoutDotFromFileName } from 'owa-file';
import type AttachmentModel from '../store/schema/AttachmentModel';

export default function getAttachmentFileType(attachmentModel: AttachmentModel) {
    const emptyFileType = '';
    let fileType = emptyFileType;
    if (attachmentModel?.model) {
        fileType =
            getExtensionWithoutDotFromFileName(attachmentModel.model.Name || emptyFileType) ||
            attachmentModel.model.ContentType ||
            emptyFileType;
    }
    return fileType;
}

// getExtensionWithoutDotFromFileName will log everything that comes after the dot, which becomes a PII leak if users create weird file names.
// They don't do that often enough to affect the data, but they do it often enough to be a risk to GDPR compliance.
export function getAttachmentFileTypeForLogging(attachmentModel: AttachmentModel) {
    return getAttachmentFileType(attachmentModel)?.substring(0, 4) || '';
}
