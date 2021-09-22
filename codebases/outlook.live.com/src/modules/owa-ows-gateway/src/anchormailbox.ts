import { getCookie } from 'owa-config';
import { getHostLocation } from 'owa-url/lib/hostLocation';
import { getUserConfiguration } from 'owa-session-store';

export function getDefaultAnchorMailboxCookie() {
    let serverRedirect = getCookie('targetServer');
    let anchorMailboxCookieName =
        'DefaultAnchorMailbox' + (serverRedirect ? '_' + serverRedirect.toLocaleLowerCase() : '');
    let anchorMailboxCookie = getCookie(anchorMailboxCookieName);

    return anchorMailboxCookie;
}

export function getAnchorMailboxHeaderForExplicitLogon() {
    let header = '';

    // see if this is an explicit logon scenario, where the target mailbox is specified in the path
    // e.g., /mail/user@contoso.com/inbox/
    let path = getHostLocation().pathname;

    let segments = path.split('/').filter(part => part.length);
    if (segments.length >= 2) {
        if (segments[1].match(/.+@.+/)) {
            header = segments[1];
        }
    }

    return header;
}

export function getAnchorMailbox() {
    let anchorMailbox = getAnchorMailboxHeaderForExplicitLogon();
    if (anchorMailbox.length === 0) {
        let userConfiguration = getUserConfiguration();
        if (userConfiguration?.SessionSettings) {
            let tenant = userConfiguration.SessionSettings.ExternalDirectoryTenantGuid;
            let puid = userConfiguration.SessionSettings.UserPuid;
            if (puid && tenant) {
                anchorMailbox = `PUID:${puid}@${tenant}`;
            }
        }
    }

    // if we don't have an anchor mailbox, get it from the
    // cookie
    if (anchorMailbox.length === 0) {
        anchorMailbox = getDefaultAnchorMailboxCookie();
    }
    return anchorMailbox;
}
