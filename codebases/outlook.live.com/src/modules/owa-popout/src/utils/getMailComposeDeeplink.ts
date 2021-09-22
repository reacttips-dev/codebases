import { MAIL_DEEPLINK_URL_BASE, COMPOSE_ROUTE } from './deeplinkConstants';
import { getSafeQueryParameters } from 'owa-url/lib/getSafeQueryParameters';
import { getQueryStringParameters } from 'owa-querystring';
import { formatUrl } from './formatUrl';
import * as querystring from 'querystring';
import { MailTo, serializeMailTo } from './MailTo';

export function getMailComposeDeeplink(): string {
    return formatUrl(MAIL_DEEPLINK_URL_BASE, COMPOSE_ROUTE, getSafeQueryParameters());
}

export function getMailToComposeDeeplink(mailTo: MailTo): string {
    if (!mailTo.to?.smtpAddress) {
        return '';
    }

    const newSearch = getQueryStringParameters();
    newSearch.mailtouri = serializeMailTo(mailTo);
    return formatUrl(MAIL_DEEPLINK_URL_BASE, COMPOSE_ROUTE, '?' + querystring.stringify(newSearch));
}
