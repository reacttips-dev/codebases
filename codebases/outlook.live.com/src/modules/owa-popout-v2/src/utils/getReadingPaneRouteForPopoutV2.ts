import type { MailboxInfo } from 'owa-client-ids';

export function getReadingPaneRouteForPopoutV2(
    mailboxInfo: MailboxInfo,
    itemId?: string,
    conversationId?: string,
    internetMessageId?: string
) {
    let route = '';
    if (internetMessageId) {
        route = 'readimid/';
        route += encodeURIComponent(btoa(internetMessageId));
    } else {
        route = conversationId ? 'readconv/' : 'read/';

        if (mailboxInfo && mailboxInfo.type == 'GroupMailbox') {
            route += 'group/';
            const emailAddressParts = mailboxInfo.mailboxSmtpAddress.split('@');
            route += `${emailAddressParts[1]}/${emailAddressParts[0]}/`;
        }

        route += encodeURIComponent(conversationId ? conversationId : itemId);
    }

    return route;
}
