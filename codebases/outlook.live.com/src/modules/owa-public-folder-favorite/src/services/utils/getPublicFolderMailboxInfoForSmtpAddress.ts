import { getUserMailboxInfo, MailboxInfo } from 'owa-client-ids';

export default function getPublicFolderMailboxInfoForSmtpAddress(
    publicFolderSmtpAddress: string
): MailboxInfo {
    const mailboxInfo: MailboxInfo = {
        type: 'PublicMailbox',
        userIdentity: getUserMailboxInfo().userIdentity,
        mailboxSmtpAddress: publicFolderSmtpAddress,
    };

    return mailboxInfo;
}
