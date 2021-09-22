import type { MailboxRequestOptions } from 'owa-request-options-types';
import type RequestOptions from 'owa-service/lib/RequestOptions';
import { createExplicitLogonRequest } from 'owa-headers';

/**
 * Used to attach headers needed for Groups/ Explicit logon scenarios
 * TODO: https://outlookweb.visualstudio.com/Outlook%20Web/_workitems/edit/80035/
 * @param mailboxRequestOptions contains MailboxInfo which contains userIdentity (upn of logged in user), mailboxSmtpAddress (upn of mailbox opened) and mailboxType
 */
export function getExplicitLogonRequestOptionsV2(
    mailboxRequestOptions: MailboxRequestOptions
): RequestOptions {
    return createExplicitLogonRequest(
        mailboxRequestOptions.mailboxInfo.mailboxSmtpAddress,
        mailboxRequestOptions
    );
}
