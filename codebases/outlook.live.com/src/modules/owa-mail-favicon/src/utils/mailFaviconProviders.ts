import getStore from '../store/store';
import { isFolderPaused } from 'owa-mail-list-store';
import folderNameToId from 'owa-session-store/lib/utils/folderNameToId';
import { getLogicalRing, getCdnUrl } from 'owa-config';
import { isHostAppFeatureEnabled } from 'owa-hostapp-feature-flags';

const FAVICON_RELATIVE_PATH = 'resources/images/favicons';
const MAIL_SEEN_FAVICON = `${FAVICON_RELATIVE_PATH}/mail-seen.ico`;
const MAIL_UNSEEN_FAVICON = `${FAVICON_RELATIVE_PATH}/mail-unseen.ico`;

const OLK_ICON = getNativeHostIconUrl('outlook.ico');
const OLK_DOGFOOD_ICON = getNativeHostIconUrl('outlook-beta.ico');
const OLK_MSIT_ICON = getNativeHostIconUrl('outlook-msit.ico');
const OLK_UNSEEN_ICON = getNativeHostIconUrl('outlook.ico'); // Temp placeholder, new icons tbd
const OLK_MAIL_UNSEEN_OVERLAY_ICON = getNativeHostIconUrl('outlook-badge-newmail.ico');

export function mailFaviconProvider(): string {
    var mailSeenIcon: string = MAIL_SEEN_FAVICON;
    var mailUnseenIcon: string = MAIL_UNSEEN_FAVICON;

    if (isHostAppFeatureEnabled('updateHostAppIcon')) {
        mailSeenIcon = getDefaultMonarchIcon();
        mailUnseenIcon = OLK_UNSEEN_ICON;
    }

    return getStore().unseenMessages === 0 || isFolderPaused(folderNameToId('inbox'))
        ? mailSeenIcon
        : mailUnseenIcon;
}

export function mailOverlayIconProvider(): string {
    if (isHostAppFeatureEnabled('updateHostAppIcon')) {
        return getStore().unseenMessages === 0 || isFolderPaused(folderNameToId('inbox'))
            ? '' // Explicitly indicates no overlay
            : OLK_MAIL_UNSEEN_OVERLAY_ICON;
    }

    return null;
}

function getDefaultMonarchIcon(): string {
    switch (getLogicalRing()) {
        case 'Dogfood':
            return OLK_DOGFOOD_ICON;
        case 'Microsoft':
            return OLK_MSIT_ICON;
        default:
            return OLK_ICON;
    }
}

function getNativeHostIconUrl(imageRelativePath: string): string {
    return `https:${getCdnUrl()}assets/native-host/icons/${imageRelativePath}`;
}
