import type { MailboxRequestOptions } from 'owa-request-options-types';
import type { RequestOptions } from 'owa-service/lib/RequestOptions';
import { getConnectedAccountRequestOptions } from 'owa-connected-account-headers';

/**
 * Used to attach headers needed for Connected Accounts scenario such as OneMailView.
 * This preserves the existing headers within incoming Request Options
 * and adds essential datatpoints
 * TODO: https://outlookweb.visualstudio.com/Outlook%20Web/_workitems/edit/80035/
 * @param mailboxInfo contains MailboxRequestOptions object which contains userIdentity (upn of logged in user), mailboxSmtpAddress (upn of mailbox opened) and mailboxType
 */
export function getConnectedAccountRequestOptionsV2(
    mailboxRequestOptions: MailboxRequestOptions
): Promise<RequestOptions> {
    return getConnectedAccountRequestOptions(mailboxRequestOptions, true);
}
