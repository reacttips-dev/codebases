import AttachmentPermissionLevel from 'owa-service/lib/contract/AttachmentPermissionLevel';
import SharingLinkKind from 'owa-service/lib/contract/SharingLinkKind';
import { OwaSharingAudience } from '../index';

export function getAttachmentPermissionLevelFromSharingLinkKind(
    linkKind: SharingLinkKind,
    isEdit: boolean,
    shouldSetPSLPermissionToEditOrView?: boolean
): AttachmentPermissionLevel {
    switch (linkKind) {
        case SharingLinkKind.AnonymousEdit:
            return AttachmentPermissionLevel.AnonymousEdit;
        case SharingLinkKind.AnonymousView:
            return AttachmentPermissionLevel.AnonymousView;
        case SharingLinkKind.OrganizationEdit:
            return AttachmentPermissionLevel.OrganizationEdit;
        case SharingLinkKind.OrganizationView:
            return AttachmentPermissionLevel.OrganizationView;
        case SharingLinkKind.Flexible:
            if (shouldSetPSLPermissionToEditOrView) {
                return isEdit ? AttachmentPermissionLevel.Edit : AttachmentPermissionLevel.View;
            }
            return AttachmentPermissionLevel.None;
        default:
            return AttachmentPermissionLevel.None;
    }
}

export function getAttachmentPermissionLevelFromSharingLinkKindAndAudience(
    linkKind: SharingLinkKind,
    audience: OwaSharingAudience,
    isEdit: boolean
): AttachmentPermissionLevel {
    const permissionLevel: AttachmentPermissionLevel = getAttachmentPermissionLevelFromSharingLinkKind(
        linkKind,
        isEdit
    );
    if (permissionLevel === AttachmentPermissionLevel.None) {
        switch (audience) {
            case OwaSharingAudience.anyone:
                return isEdit
                    ? AttachmentPermissionLevel.AnonymousEdit
                    : AttachmentPermissionLevel.AnonymousView;
            case OwaSharingAudience.organization:
                return isEdit
                    ? AttachmentPermissionLevel.OrganizationEdit
                    : AttachmentPermissionLevel.OrganizationView;
            case OwaSharingAudience.customLabeledSpecificPeople:
                return isEdit ? AttachmentPermissionLevel.Edit : AttachmentPermissionLevel.View;
            default:
                return AttachmentPermissionLevel.None;
        }
    }

    return permissionLevel;
}
