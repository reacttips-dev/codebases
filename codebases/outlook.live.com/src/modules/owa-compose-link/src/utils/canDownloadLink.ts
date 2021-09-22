import { getExtensionFromFileName } from 'owa-file';
import type { SharingLinkInfo } from 'owa-link-data';
import { TEXT_DIRECTORY_MIME_TYPE } from 'owa-fileprovider-link-services';
import getAttachmentPolicy from 'owa-session-store/lib/utils/getAttachmentPolicy';

export function canDownloadLink(sharingLinkInfo: SharingLinkInfo): boolean {
    const classicAttachmentsEnabled: boolean = getAttachmentPolicy().ClassicAttachmentsEnabled;
    if (!classicAttachmentsEnabled || sharingLinkInfo.sharingInfo.blocksDownload) {
        return false;
    }

    // We cannot download OneNotes or folders
    const mimeType: string = sharingLinkInfo.mimeType;
    if (mimeType && (mimeType === 'application/onenote' || mimeType === TEXT_DIRECTORY_MIME_TYPE)) {
        return false;
    }

    if (sharingLinkInfo.sharingInfo?.blocksDownload) {
        return false;
    }

    const extension = (getExtensionFromFileName(sharingLinkInfo.fileName) || '').toLowerCase();
    if (extension === '.fluid') {
        return false;
    }

    return true;
}
