import {
    MailboxInfo,
    getRoutingKeyPrefixForSmtpAddress,
    getDefaultRoutingKey,
} from 'owa-client-ids';
import { isConnectedAccount } from 'owa-accounts-store';

export function getRoutingKeyForMailboxInfo(mailboxInfo: MailboxInfo): string {
    if (mailboxInfo.type == 'ArchiveMailbox') {
        // For archive mailboxes attachment routing keys use defaultRoutingKey,
        // not the mailboxSmtpAddress (which is anchorMbxGuid@tenantGuid).
        return getDefaultRoutingKey();
    }

    // If this is a connected account, use the userIdentity as the smtpAddress
    // and the mailboxSmtpAddress for generating the prefix.
    // e.g. Calendar OneView where a consumer account is accessed from a business login
    const isAConnectedAccount =
        mailboxInfo.userIdentity && isConnectedAccount(mailboxInfo.userIdentity);
    const isGroup = mailboxInfo.type === 'GroupMailbox';
    if (isAConnectedAccount && !isGroup) {
        return (
            getRoutingKeyPrefixForSmtpAddress(mailboxInfo.mailboxSmtpAddress) +
            mailboxInfo.userIdentity
        );
    }

    // For UserMailbox, use getDefaultRoutingKey which will do additional checks
    // e.g. EASI ID checks and add the prefix as needed
    if (mailboxInfo.type === 'UserMailbox') {
        return getDefaultRoutingKey();
    } else {
        // For all other mailbox types (group, shared, public), just use the mailboxSmtpAddress
        // Adding a prefix doesn't work
        return mailboxInfo.mailboxSmtpAddress;
    }
}
