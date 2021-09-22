import { MailboxInfo, getUserMailboxInfo } from 'owa-client-ids';

// Map<groupId, MailboxInfo>
const groupMailboxInfoMap: { [key: string]: MailboxInfo } = {};

export default function getGroupMailboxInfo(groupId: string): MailboxInfo {
    const groupIdKey = groupId.toLocaleLowerCase();
    if (!groupMailboxInfoMap[groupIdKey]) {
        const groupMailboxInfo: MailboxInfo = {
            type: 'GroupMailbox',
            userIdentity: getUserMailboxInfo().userIdentity,
            mailboxSmtpAddress: groupId,
        };
        groupMailboxInfoMap[groupIdKey] = groupMailboxInfo;
    }

    return groupMailboxInfoMap[groupIdKey];
}
