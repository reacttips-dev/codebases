import { getExtensionFromFileName } from 'owa-file';
import type AttachmentType from 'owa-service/lib/contract/AttachmentType';

const videoFileExtensions: string[] = ['.mp4'];
const videoFileExtensionsForSafari: string[] = ['.mov'];

export default function shouldPreviewVideo(
    attachment: AttachmentType,
    userAgentString?: string
): boolean {
    const extension: string = getExtensionFromFileName(attachment.Name);

    if (extension) {
        const ua =
            userAgentString || (window?.navigator?.userAgent ? window.navigator.userAgent : '');
        const isBrowserSafari = ua.indexOf('Safari') !== -1 && ua.indexOf('Chrome') === -1;

        return (
            videoFileExtensions.indexOf(extension.toLowerCase()) >= 0 ||
            (isBrowserSafari && videoFileExtensionsForSafari.indexOf(extension.toLowerCase()) >= 0)
        );
    }

    return false;
}
