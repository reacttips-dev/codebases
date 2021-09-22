import AttachmentDataProviderType from 'owa-service/lib/contract/AttachmentDataProviderType';
import { getBoxFileInfo } from './getBoxFileInfo';
import { getDropboxFileInfo } from './getDropboxFileInfo';
import { getGDriveFileInfo } from './getGDriveFileInfo';
import { getODBFileInfo } from './getODBFileInfo';
import { getODCFileInfo } from './getODCFileInfo';
import type { GetSharingInfoResponseBase } from './GetSharingInfoResponseBase';

export async function getFileInfo(
    url: string,
    attachmentDataProviderType: AttachmentDataProviderType
): Promise<GetSharingInfoResponseBase> {
    switch (attachmentDataProviderType) {
        case AttachmentDataProviderType.OneDrivePro:
            return getODBFileInfo(url);
        case AttachmentDataProviderType.OneDriveConsumer:
            return getODCFileInfo(url);
        case AttachmentDataProviderType.Dropbox:
            return getDropboxFileInfo(url);
        case AttachmentDataProviderType.Box:
            return getBoxFileInfo(url);
        case AttachmentDataProviderType.GDrive:
            return getGDriveFileInfo(url);
        default:
            throw new Error(`getFileInfo is not supported for ${attachmentDataProviderType}.`);
    }
}
