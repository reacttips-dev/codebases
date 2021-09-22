import { logUsage } from 'owa-analytics';
import { TEXT_DIRECTORY_MIME_TYPE } from '../index';
import AttachmentResultCode from 'owa-service/lib/contract/AttachmentResultCode';
import SharingLinkKind from 'owa-service/lib/contract/SharingLinkKind';
import { SharingLinkTypeEdit, UNDEFINED_EXPIRATION_DATE } from '../utils/constants';
import { getODCDriveItem, GetODCDriveItemResponse } from './getODCDriveItem';
import { getODCFilePermission, ODCLinkPermission } from './getODCFilePermission';
import type { GetODCSharingInfoResponse } from './GetODCSharingInfoResponse';

export async function getODCFileInfo(url: string): Promise<GetODCSharingInfoResponse> {
    const driveItemResponse: GetODCDriveItemResponse = await getODCDriveItem(url);
    const linkPermission: ODCLinkPermission = await getODCFilePermission(url);

    let sharingLinkKind: SharingLinkKind;
    if (linkPermission.invitation?.signInRequired) {
        sharingLinkKind = SharingLinkKind.Flexible;
    } else {
        sharingLinkKind =
            linkPermission.link.type === SharingLinkTypeEdit
                ? SharingLinkKind.AnonymousEdit
                : SharingLinkKind.AnonymousView;
    }

    logUsage('getODCFileInfo', { isPSL: sharingLinkKind === SharingLinkKind.Flexible });

    return {
        ResultCode: AttachmentResultCode.Success,
        FileName: driveItemResponse.name,
        MimeType: driveItemResponse.file
            ? driveItemResponse.file.mimeType
            : TEXT_DIRECTORY_MIME_TYPE,
        SharingLinkKind: sharingLinkKind,
        BlocksDownload: false,
        CanShareExternally: true,
        CanCreateAnonymousEditLink: true,
        CanCreateAnonymousViewLink: true,
        ExpirationDate:
            linkPermission.expirationDateTime === UNDEFINED_EXPIRATION_DATE
                ? null
                : linkPermission.expirationDateTime,
        OriginalUrl: null,
        Type: linkPermission.link.type,
        providerFileId: driveItemResponse.id,
        location: url,
        ShareId: linkPermission.shareId,
    };
}
