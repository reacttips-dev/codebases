import type { MailboxRequestOptions } from 'owa-request-options-types';
import type { MailboxType } from 'owa-client-ids';
import { getConnectedAccountHeaders } from './getConnectedAccountHeaders';
import { setHeaders, getRequestOptionsOrDefault } from 'owa-headers-core';
import type { RequestOptions, HeadersWithoutIterator } from 'owa-service/lib/RequestOptions';
import * as trace from 'owa-trace';

/**
NOTE: Please do not use this function for any of the newer scenarios e.g. OneMailView,
OWA Auth team has put a new flow in place for all scenarios needing
Connected Accounts support. Please reach out to Auth team for more information
*/
export async function getConnectedAccountRequestOptions(
    mailboxRequestOptions: MailboxRequestOptions,
    preserveOriginalHeaders?: boolean
): Promise<RequestOptions> {
    const defaultRequestOptions = getRequestOptionsOrDefault();
    defaultRequestOptions.headers = await getHeadersForConnectedAccount(
        mailboxRequestOptions,
        preserveOriginalHeaders
    );
    defaultRequestOptions.authNeededOnUnAuthorized = false;
    defaultRequestOptions.datapoint = defaultRequestOptions.datapoint || {};
    defaultRequestOptions.datapoint.mailbox = 'Connected';
    return defaultRequestOptions;
}

export async function getHeadersForConnectedAccount(
    mailboxRequestOptions: MailboxRequestOptions,
    preserveOriginalHeaders?: boolean
): Promise<HeadersWithoutIterator> {
    const headers =
        preserveOriginalHeaders && mailboxRequestOptions.headers?.set
            ? new Headers(<Headers>mailboxRequestOptions.headers)
            : new Headers();

    const connectedAccountHeaders = await getConnectedAccountHeaders(
        mailboxRequestOptions.mailboxInfo.userIdentity,
        isSharedTypeMailbox(
            mailboxRequestOptions.mailboxInfo.type,
            mailboxRequestOptions.mailboxInfo.mailboxSmtpAddress
        )
            ? mailboxRequestOptions.mailboxInfo.mailboxSmtpAddress
            : null
    );
    setHeaders(headers, connectedAccountHeaders);

    return headers;
}

export function isSharedTypeMailbox(mailboxType: MailboxType, mailboxSmtpAddress: string): boolean {
    const isSharedTypeMailbox =
        mailboxType == 'GroupMailbox' ||
        mailboxType == 'TeamsMailbox' ||
        mailboxType == 'SharedMailbox' ||
        mailboxType == 'PublicMailbox';
    if (isSharedTypeMailbox && mailboxSmtpAddress == null) {
        trace.errorThatWillCauseAlert(
            'getHeadersForConnectedAccount: mailboxSmtpAddress should be passed for Group or Teams or Shared or Public Mbx request'
        );
    }

    return isSharedTypeMailbox;
}
