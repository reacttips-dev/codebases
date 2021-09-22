import {
    RefreshLinkFailedText,
    LinkExpiredShortText,
    LinkWillExpireText,
    RefreshLinkFailedTooltipText,
    LinkWillExpireTooltipText,
    LinkHasExpiredTooltipText,
} from './sharingTipStrings.locstring.json';
import loc, { format } from 'owa-localize';
import { isExpirationTip } from './isExpirationTip';
import { assertNever } from 'owa-assert';
import { OwaDate, formatShortMonthDayYear } from 'owa-datetime';
import { LinkActionStatus } from 'owa-link-data';
import { SharingTipId } from 'owa-sharing-data';

export function getDisplayString(
    sharingTipId: SharingTipId,
    defaultString: string,
    refreshStatus: LinkActionStatus,
    expirationDate: OwaDate | null
): string {
    switch (sharingTipId) {
        case SharingTipId.externalRecipientCSL:
        case SharingTipId.getSharingInfoFailed:
        case SharingTipId.noPermissionSet:
        case SharingTipId.noPermissionToShare:
        case SharingTipId.noPermissionToShareExternally:
        case SharingTipId.sharingWithLargeDL:
            return defaultString;
        case SharingTipId.linkHasExpired:
        case SharingTipId.linkWillExpire:
            return getShortExpirationString(sharingTipId, refreshStatus, expirationDate);
        default:
            return assertNever(sharingTipId);
    }
}

function getShortExpirationString(
    sharingTipId: SharingTipId,
    refreshStatus: LinkActionStatus,
    expirationDate: OwaDate | null
): string {
    if (refreshStatus === LinkActionStatus.refreshFailed) {
        return loc(RefreshLinkFailedText);
    }

    if (sharingTipId === SharingTipId.linkHasExpired) {
        return loc(LinkExpiredShortText);
    }

    const dateString = formatShortMonthDayYear(expirationDate);
    return format(loc(LinkWillExpireText), dateString);
}

export function getInfoIconTooltip(
    sharingTipId: SharingTipId,
    refreshStatus: LinkActionStatus
): string | null {
    // We only offer tooltips for expired/expiring links
    if (!isExpirationTip(sharingTipId)) {
        return null;
    }

    if (refreshStatus === LinkActionStatus.refreshFailed) {
        return loc(RefreshLinkFailedTooltipText);
    }

    if (sharingTipId === SharingTipId.linkWillExpire) {
        return loc(LinkWillExpireTooltipText);
    }

    if (sharingTipId === SharingTipId.linkHasExpired) {
        return loc(LinkHasExpiredTooltipText);
    }

    return null;
}
