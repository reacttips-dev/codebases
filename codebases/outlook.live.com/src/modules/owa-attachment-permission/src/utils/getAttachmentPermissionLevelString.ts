import {
    AttachPerms_AnyoneCanView,
    AttachPerms_AnyoneCanEdit,
    AttachPerms_OrganizationEdit,
    AttachPerms_OrganizationView,
    AttachPerms_RecipientsCanView,
    AttachPerms_RecipientsCanEdit,
    AttachPerms_NoPermissionToShare,
    ODBAttachPerms_AnyoneCanView,
    ODBAttachPerms_AnyoneCanEdit,
    ODBAttachPerms_OrganizationEdit,
    ODBAttachPerms_OrganizationView,
} from './getAttachmentPermissionLevelString.locstring.json';
import loc, { format } from 'owa-localize';
import { ONE_DRIVE_PRO } from './constants';
import { assertNever } from 'owa-assert';
import AttachmentPermissionLevel from 'owa-service/lib/contract/AttachmentPermissionLevel';
import getUserConfiguration from 'owa-session-store/lib/actions/getUserConfiguration';
import AttachmentDataProviderType from 'owa-service/lib/contract/AttachmentDataProviderType';

export function getAttachmentPermissionLevelString(
    permissionLevel: AttachmentPermissionLevel,
    providerType: string | null
): string {
    switch (permissionLevel) {
        case AttachmentPermissionLevel.AnonymousView:
            return loc(AttachPerms_AnyoneCanView);
        case AttachmentPermissionLevel.AnonymousEdit:
            return loc(AttachPerms_AnyoneCanEdit);
        case AttachmentPermissionLevel.OrganizationEdit:
            return loc(AttachPerms_OrganizationEdit);
        case AttachmentPermissionLevel.OrganizationView:
            return loc(AttachPerms_OrganizationView);
        case AttachmentPermissionLevel.View:
            return providerType === ONE_DRIVE_PRO
                ? loc(AttachPerms_RecipientsCanView)
                : loc(AttachPerms_AnyoneCanView);
        case AttachmentPermissionLevel.Edit:
            return providerType === ONE_DRIVE_PRO
                ? loc(AttachPerms_RecipientsCanEdit)
                : loc(AttachPerms_AnyoneCanEdit);
        case AttachmentPermissionLevel.None:
            return loc(AttachPerms_NoPermissionToShare);
        default:
            return assertNever(permissionLevel);
    }
}

export function getLinkPermissionLevelString(
    permissionLevel: AttachmentPermissionLevel,
    providerType: AttachmentDataProviderType
): string {
    if (providerType === AttachmentDataProviderType.OneDrivePro) {
        return getODBAttachmentPermissionLevelString(permissionLevel);
    }

    return getAttachmentPermissionLevelString(permissionLevel, null);
}

export function getODBAttachmentPermissionLevelString(
    permissionLevel: AttachmentPermissionLevel
): string {
    const companyName = getUserConfiguration().SessionSettings?.CompanyName;
    switch (permissionLevel) {
        case AttachmentPermissionLevel.AnonymousView:
            return loc(ODBAttachPerms_AnyoneCanView);
        case AttachmentPermissionLevel.AnonymousEdit:
            return loc(ODBAttachPerms_AnyoneCanEdit);
        case AttachmentPermissionLevel.OrganizationEdit:
            return format(loc(ODBAttachPerms_OrganizationEdit), companyName);
        case AttachmentPermissionLevel.OrganizationView:
            return format(loc(ODBAttachPerms_OrganizationView), companyName);
        case AttachmentPermissionLevel.View:
            return loc(AttachPerms_RecipientsCanView);
        case AttachmentPermissionLevel.Edit:
            return loc(AttachPerms_RecipientsCanEdit);
        case AttachmentPermissionLevel.None:
            return loc(AttachPerms_NoPermissionToShare);
        default:
            return assertNever(permissionLevel);
    }
}
