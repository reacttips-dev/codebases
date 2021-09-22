import AttachmentPermissionLevel from 'owa-service/lib/contract/AttachmentPermissionLevel';

export function isGuestUrlPermissionLevel(permLevel: AttachmentPermissionLevel): boolean {
    // Based on the permission level, we can detect whether it is shared through guest url
    switch (permLevel) {
        case AttachmentPermissionLevel.AnonymousEdit:
        case AttachmentPermissionLevel.AnonymousView:
        case AttachmentPermissionLevel.OrganizationEdit:
        case AttachmentPermissionLevel.OrganizationView:
            return true;
        default:
            return false;
    }
}
