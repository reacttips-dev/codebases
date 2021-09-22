import type RequestOptions from 'owa-service/lib/RequestOptions';
import type { MailboxRequestOptions } from 'owa-request-options-types';
import { getRequestOptionsOrDefaultV2 } from './getRequestOptionsOrDefaultV2';
import { getConnectedAccountRequestOptionsV2 } from './getConnectedAccountRequestOptionsV2';
import { isConnectedAccount } from 'owa-accounts-store';
import { getExplicitLogonRequestOptionsV2 } from './getExplicitLogonRequestOptionsV2';
import { getArchiveMailboxRequestOptions } from './getArchiveMailboxRequestOptions';
import { isSharedTypeMailbox } from 'owa-connected-account-headers';

/**
 * getMailboxSpecificRequestOptions is used to intercept requests at owa-service and add
 * appropriate headers specific to Connected Accounts, Explicit logon etc.
 * @param options specifies MailboxRequestOptions which contains userIdentity (upn of logged in user), mailboxSmtpAddress (upn of mailbox opened) and mailboxType
 */
export default function getMailboxSpecificRequestOptions(
    options: RequestOptions | undefined
): RequestOptions | null | Promise<RequestOptions> {
    const mailboxRequestOptions = options as MailboxRequestOptions;
    const userIdentity = mailboxRequestOptions?.mailboxInfo?.userIdentity;

    if (!userIdentity) {
        return options;
    }

    const mailboxSmtpAddress = mailboxRequestOptions.mailboxInfo.mailboxSmtpAddress;
    const mailboxType = mailboxRequestOptions.mailboxInfo.type;
    if (isConnectedAccount(userIdentity)) {
        return getConnectedAccountRequestOptionsV2(mailboxRequestOptions);
    }

    if (isSharedTypeMailbox(mailboxType, mailboxSmtpAddress)) {
        return getExplicitLogonRequestOptionsV2(mailboxRequestOptions);
    }

    if (mailboxType == 'ArchiveMailbox') {
        return getArchiveMailboxRequestOptions(mailboxRequestOptions);
    }

    return getRequestOptionsOrDefaultV2(options);
}
