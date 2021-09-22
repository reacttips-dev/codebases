import { createAttachmentPermissionLevelsFromSharingInfo } from 'owa-attachment-permission';
import type { AttachmentPolicyInfo } from 'owa-attachment-policy';
import { getExtensionFromFileName } from 'owa-file';
import type AttachmentPermissionLevel from 'owa-service/lib/contract/AttachmentPermissionLevel';
import type AttachmentType from 'owa-service/lib/contract/AttachmentType';
import type GetSharingInfoResponse from 'owa-service/lib/contract/GetSharingInfoResponse';
import type { ODBSharingInfo } from 'owa-sharing-data';
import AttachmentClass from '../../store/schema/AttachmentClass';
import type AttachmentInfo from '../../store/schema/AttachmentInfo';
import createSharingInfoFromGetSharingInfoResponse from '../../utils/createSharingInfoFromGetSharingInfoResponse';
import getAllowDownload from './getAllowDownload';
import getSupportedPermissionLevels from './getSupportedPermissionLevels';
import AttachmentDataProviderType from 'owa-service/lib/contract/AttachmentDataProviderType';

export default function createAttachmentInfo(
    attachmentPolicyInfo: AttachmentPolicyInfo,
    attachmentClass: AttachmentClass,
    attachment: AttachmentType,
    isCloudy: boolean,
    providerType: string | null,
    permissionInfo: GetSharingInfoResponse = null
): AttachmentInfo {
    if (attachmentClass === AttachmentClass.Blocked) {
        return createBlockedAttachmentInfo();
    }

    const extension = getExtensionFromFileName(attachment.Name);
    const allowDownload = getAllowDownload(attachmentPolicyInfo, attachment, extension);

    // GetSharingInfoResponse is only for ODB reference attachments.
    const supportedPermissionLevels = getSupportedPermissionLevels(
        isCloudy,
        providerType,
        createAttachmentPermissionLevelsFromSharingInfo(
            permissionInfo,
            AttachmentDataProviderType.OneDrivePro
        )
    );
    const sharingInfo: ODBSharingInfo = createSharingInfoFromGetSharingInfoResponse(permissionInfo);

    if (isCloudy) {
        return createReferenceGenericAttachmentInfo(
            allowDownload,
            supportedPermissionLevels,
            sharingInfo
        );
    }
    return createClassicGenericAttachmentInfo(allowDownload);
}

function createClassicGenericAttachmentInfo(allowDownload: boolean): AttachmentInfo {
    return {
        allowDownload: allowDownload,
        supportedPermissionLevels: null,
        sharingInfo: null,
    };
}

function createReferenceGenericAttachmentInfo(
    allowDownload: boolean,
    supportedPermissionLevels: AttachmentPermissionLevel[],
    sharingInfo: ODBSharingInfo
): AttachmentInfo {
    return {
        allowDownload: allowDownload,
        supportedPermissionLevels: supportedPermissionLevels,
        sharingInfo: sharingInfo,
    };
}

function createBlockedAttachmentInfo(): AttachmentInfo {
    return {
        allowDownload: false,
        supportedPermissionLevels: null,
        sharingInfo: null,
    };
}
