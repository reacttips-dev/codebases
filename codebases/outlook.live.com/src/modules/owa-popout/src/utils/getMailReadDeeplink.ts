import { MAIL_DEEPLINK_URL_BASE, MAIL_READ_ROUTE, GROUP_READ_ROUTE } from './deeplinkConstants';
import { getSafeQueryParameters } from 'owa-url/lib/getSafeQueryParameters';
import { formatUrl } from './formatUrl';

export function getMailReadDeeplink(itemId: string): string {
    return itemId
        ? formatUrl(
              MAIL_DEEPLINK_URL_BASE,
              MAIL_READ_ROUTE + '/' + encodeURIComponent(itemId),
              getSafeQueryParameters()
          )
        : '';
}

export function getMailReadDeeplinkForGroupMailbox(itemId: string, groupMailboxId: string): string {
    if (itemId && groupMailboxId && groupMailboxId.indexOf('@') > 0) {
        const emailAddressParts = groupMailboxId.split('@');
        const route =
            MAIL_READ_ROUTE +
            '/' +
            encodeURIComponent(itemId) +
            '/' +
            GROUP_READ_ROUTE +
            `/${emailAddressParts[1]}/${emailAddressParts[0]}`;
        return formatUrl(MAIL_DEEPLINK_URL_BASE, route, getSafeQueryParameters());
    } else {
        return '';
    }
}
