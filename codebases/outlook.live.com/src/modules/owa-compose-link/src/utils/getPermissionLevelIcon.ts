import AttachmentPermissionLevel from 'owa-service/lib/contract/AttachmentPermissionLevel';
import SharingLinkKind from 'owa-service/lib/contract/SharingLinkKind';

export function getPermissionLevelIcon(permissionLevel: AttachmentPermissionLevel): string {
    const linkKind: SharingLinkKind = getSharingLinkKindFromAttachmentPermissionLevel(
        permissionLevel
    );

    const svgIcon = getLinkIconUrl(linkKind);
    return svgIcon;
}

// This converts to OneDrive's definition of SharingLinkKind, not Exchanges. A similar method using the Exchange definition should be used
// if this was needed elsewhere in code, which is why it is in this file instead of a more generic place.
function getSharingLinkKindFromAttachmentPermissionLevel(
    permissionLevel: AttachmentPermissionLevel
): SharingLinkKind {
    switch (permissionLevel) {
        case AttachmentPermissionLevel.AnonymousEdit:
            return SharingLinkKind.AnonymousEdit;
        case AttachmentPermissionLevel.AnonymousView:
            return SharingLinkKind.AnonymousView;
        case AttachmentPermissionLevel.OrganizationEdit:
            return SharingLinkKind.OrganizationEdit;
        case AttachmentPermissionLevel.OrganizationView:
            return SharingLinkKind.OrganizationView;
        case AttachmentPermissionLevel.Edit:
        case AttachmentPermissionLevel.View:
            return SharingLinkKind.Flexible;
        default:
            return SharingLinkKind.Direct;
    }
}

function getLinkIconUrl(linkKind: SharingLinkKind): string {
    const iconBaseUrl = 'https://static2.sharepointonline.com/files/fabric/assets/icons/sharing';
    switch (linkKind) {
        case SharingLinkKind.OrganizationView:
        case SharingLinkKind.OrganizationEdit:
            return `${iconBaseUrl}/companyonly.svg`;
        case SharingLinkKind.AnonymousView:
        case SharingLinkKind.AnonymousEdit:
            return `${iconBaseUrl}/anyone.svg`;
        case SharingLinkKind.Flexible:
            return `${iconBaseUrl}/directrecipients.svg`;
        default:
            return `${iconBaseUrl}/existingaccess.svg?v2`;
    }
}
