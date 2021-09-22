import type { GetSharingInfoResponseBase } from 'owa-fileprovider-link-services';
import AttachmentDataProviderType from 'owa-service/lib/contract/AttachmentDataProviderType';
import AttachmentPermissionLevel from 'owa-service/lib/contract/AttachmentPermissionLevel';
import type GetSharingInfoResponse from 'owa-service/lib/contract/GetSharingInfoResponse';

export function createAttachmentPermissionLevelsFromSharingInfo(
    sharingInformation: GetSharingInfoResponseBase | null,
    providerType: AttachmentDataProviderType
): AttachmentPermissionLevel[] {
    if (sharingInformation === null) {
        return [];
    }

    const supportedPermissions: AttachmentPermissionLevel[] = [];

    if (providerType === AttachmentDataProviderType.OneDrivePro) {
        const sharingInfo: GetSharingInfoResponse = <GetSharingInfoResponse>sharingInformation;

        if (sharingInfo.CanShareInternally) {
            supportedPermissions.push(AttachmentPermissionLevel.Edit);
            supportedPermissions.push(AttachmentPermissionLevel.View);
        }

        if (sharingInfo.CanCreateOrganizationEditLink) {
            supportedPermissions.push(AttachmentPermissionLevel.OrganizationEdit);
        }

        if (sharingInfo.CanCreateOrganizationViewLink) {
            supportedPermissions.push(AttachmentPermissionLevel.OrganizationView);
        }
    }

    if (sharingInformation.CanCreateAnonymousEditLink) {
        supportedPermissions.push(AttachmentPermissionLevel.AnonymousEdit);
    }

    if (sharingInformation.CanCreateAnonymousViewLink) {
        supportedPermissions.push(AttachmentPermissionLevel.AnonymousView);
    }

    if (supportedPermissions.length > 0) {
        return supportedPermissions;
    }

    return [];
}
