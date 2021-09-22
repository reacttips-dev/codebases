import getExtensionFromFileName from './getExtensionFromFileName';
import { isFeatureEnabled } from 'owa-feature-flags';

const thumbnailableDocumentExtensions: string[] = [
    '.pdf',
    '.doc',
    '.docx',
    '.odt',
    '.rtf',
    '.ppt',
    '.pptx',
    '.pptm',
    '.potx',
    '.potm',
    '.pot',
    '.ppxx',
    '.pps',
    '.odp',
];

export default function isThumbnailableDocument(fileName: string): boolean {
    if (!isFeatureEnabled('doc-attachment-documentThumbnail')) {
        return false;
    }

    const extension: string | null = getExtensionFromFileName(fileName);
    if (extension) {
        return thumbnailableDocumentExtensions.indexOf(extension.toLowerCase()) >= 0;
    }

    return false;
}
