import { getExtensionFromFileName } from 'owa-file';
import type AttachmentType from 'owa-service/lib/contract/AttachmentType';

const audioFileExtensions: string[] = ['.mp3'];

export default function shouldPreviewAudio(attachment: AttachmentType): boolean {
    const extension: string = getExtensionFromFileName(attachment.Name);

    if (extension) {
        return audioFileExtensions.indexOf(extension.toLowerCase()) >= 0;
    }

    return false;
}
