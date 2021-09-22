// If adding a new SharingTipId, be sure to add it to the sharingTipIdsList below as well
export enum SharingTipId {
    noPermissionToShare = 'WarningNoPermissionToShare',
    getSharingInfoFailed = 'WarningGetSharingInfoFailed',
    linkHasExpired = 'WarningLinksHasExpired',
    linkWillExpire = 'WarningLinksWillExpire',
    noPermissionToShareExternally = 'WarningExternalRecipientButNoPermissionToShareExternally',
    externalRecipientCSL = 'WarningExternalRecipientsCannotOpenCSLs',
    noPermissionSet = 'WarningOnlyPeopleWithExistingAccessCanAccess',
    sharingWithLargeDL = 'WarningNotAllMembersOfDLCanAccess',
}

export function getSharingTipIdsList(): SharingTipId[] {
    return [
        SharingTipId.noPermissionToShare,
        SharingTipId.getSharingInfoFailed,
        SharingTipId.linkHasExpired,
        SharingTipId.linkWillExpire,
        SharingTipId.noPermissionToShareExternally,
        SharingTipId.externalRecipientCSL,
        SharingTipId.noPermissionSet,
        SharingTipId.sharingWithLargeDL,
    ];
}
