import { isFeatureEnabled } from 'owa-feature-flags';
import AttachmentPermissionLevel from 'owa-service/lib/contract/AttachmentPermissionLevel';

export const SUFFIX: string = '_ODSPPSL';

export function getLinkIdFromAnchorElementId(anchorElementId: string): string {
    if (isFeatureEnabled('doc-link-savePermission')) {
        if (anchorElementId && anchorElementId.indexOf(SUFFIX) !== -1) {
            return anchorElementId.substring(0, anchorElementId.length - SUFFIX.length);
        }
    }

    return anchorElementId;
}

export function isRecipientsOfThisMessagePermission(anchorElementId: string): boolean {
    if (isFeatureEnabled('doc-link-savePermission')) {
        return anchorElementId.lastIndexOf(SUFFIX) === anchorElementId.length - SUFFIX.length;
    }

    return false;
}

export function getAnchorElementId(linkId: string, permissionLevel: AttachmentPermissionLevel) {
    if (
        isFeatureEnabled('doc-link-savePermission') &&
        (permissionLevel === AttachmentPermissionLevel.Edit ||
            permissionLevel === AttachmentPermissionLevel.View)
    ) {
        return linkId + SUFFIX;
    }

    return linkId;
}
