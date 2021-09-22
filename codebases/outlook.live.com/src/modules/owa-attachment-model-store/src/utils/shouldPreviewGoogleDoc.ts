import type AttachmentType from 'owa-service/lib/contract/AttachmentType';

export const previewableGoogleDocContentTypes = [
    'application/vnd.google-apps.document',
    'application/vnd.google-apps.spreadsheet',
    'application/vnd.google-apps.presentation',
];

export default function shouldPreviewGoogleDoc(attachment: AttachmentType): boolean {
    return (
        !!attachment.ContentType &&
        previewableGoogleDocContentTypes.indexOf(attachment.ContentType.toLowerCase()) > -1
    );
}
