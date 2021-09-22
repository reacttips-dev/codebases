import isPdf from './isPdf';
import type AttachmentType from 'owa-service/lib/contract/AttachmentType';

export default function shouldPreviewPdfJs(attachment: AttachmentType): boolean {
    return isPdf(attachment);
}
