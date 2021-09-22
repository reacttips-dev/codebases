import { SharingTipId } from 'owa-sharing-data';

export function isExpirationTip(sharingTipId: SharingTipId): boolean {
    return (
        sharingTipId === SharingTipId.linkHasExpired || sharingTipId === SharingTipId.linkWillExpire
    );
}
