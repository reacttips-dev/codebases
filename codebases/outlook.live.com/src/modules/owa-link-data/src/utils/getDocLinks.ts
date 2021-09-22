import getSharingLinkInfo from '../selectors/getSharingLinkInfo';
import { isFluidFile } from '../utils/isFluidFile';
import AttachmentPermissionLevel from 'owa-service/lib/contract/AttachmentPermissionLevel';
import AttachmentPermissionType from 'owa-service/lib/contract/AttachmentPermissionType';
import type DocLink from 'owa-service/lib/contract/DocLink';
import { isFeatureEnabled } from 'owa-feature-flags';

export function getDocLinks(sharingLinkIds: string[] | null): DocLink[] {
    const docLinks: DocLink[] = [];
    sharingLinkIds?.forEach(id => {
        const sharingLinkInfo = getSharingLinkInfo(id);
        if (!sharingLinkInfo) {
            return;
        }
        const attachmentPermissionType: AttachmentPermissionType = getAttachmentPermissionTypeFromAttachmentPermissionLevel(
            sharingLinkInfo.permissionLevel
        );

        // For Fluid links that are org or anonymous sharing links, set the DocLinks property to pre-redeem them.
        const isFluidSharingLink: boolean =
            isFeatureEnabled('cmp-prague') &&
            isOrgOrAnonymousSharingLink(attachmentPermissionType) &&
            isFluidFile(sharingLinkInfo.fileName);

        if (
            attachmentPermissionType === AttachmentPermissionType.View ||
            attachmentPermissionType === AttachmentPermissionType.Edit ||
            isFluidSharingLink
        ) {
            const docLink: DocLink = {
                ProviderType: 'OneDrivePro',
                Url: sharingLinkInfo.url,
                PermissionType: attachmentPermissionType,
            };
            docLinks.push(docLink);
        }
    });

    return docLinks;
}

function isOrgOrAnonymousSharingLink(permissionLevel: AttachmentPermissionType): boolean {
    switch (permissionLevel) {
        case AttachmentPermissionType.AnonymousEdit:
        case AttachmentPermissionType.AnonymousView:
        case AttachmentPermissionType.OrganizationEdit:
        case AttachmentPermissionType.OrganizationView:
            return true;
        default:
            return false;
    }
}

function getAttachmentPermissionTypeFromAttachmentPermissionLevel(
    permissionLevel: AttachmentPermissionLevel
): AttachmentPermissionType {
    switch (permissionLevel) {
        case AttachmentPermissionLevel.AnonymousEdit:
            return AttachmentPermissionType.AnonymousEdit;
        case AttachmentPermissionLevel.AnonymousView:
            return AttachmentPermissionType.AnonymousView;
        case AttachmentPermissionLevel.OrganizationEdit:
            return AttachmentPermissionType.OrganizationEdit;
        case AttachmentPermissionLevel.OrganizationView:
            return AttachmentPermissionType.OrganizationView;
        case AttachmentPermissionLevel.Edit:
            return AttachmentPermissionType.Edit;
        case AttachmentPermissionLevel.View:
            return AttachmentPermissionType.View;
        default:
            return AttachmentPermissionType.None;
    }
}
