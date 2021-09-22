import { getDefaultUserEmailAddress, getDefaultLogonEmailAddress } from 'owa-session-store';
import type MailboxInfo from '../schema/MailboxInfo';
import type MailboxType from '../schema/MailboxType';
import getStore from '../store';

/**
Gets the mailboxInfo object for given userIdentity.
This also adds to the map of mailboxInfos keyed on userIdentity passed in.
The Map only holds userMailbox type info's (and not group mailbox info's)
and hence the userIdentity and mailboxSmtpAddress are both assigned the same userIdentity value in case of connected account
@param userIdentity userIdentity of the userMailbox required. If not passed, we assume default user
 */
export default function getUserMailboxInfo(userIdentity?: string | null): MailboxInfo {
    const userMailboxInfoMap = getStore().userMailboxInfoMap;
    if (!userMailboxInfoMap || !userMailboxInfoMap.get(userIdentity)) {
        let isConnectedAccount: Boolean = false;
        if (userIdentity) {
            isConnectedAccount = userIdentity == getDefaultLogonEmailAddress() ? false : true;
        }
        let userMailboxInfo = {
            type: 'UserMailbox' as MailboxType,
            userIdentity: isConnectedAccount ? userIdentity : getDefaultLogonEmailAddress(),
            mailboxSmtpAddress: isConnectedAccount ? userIdentity : getDefaultUserEmailAddress(),
        };

        userMailboxInfoMap.set(userIdentity, userMailboxInfo);

        return userMailboxInfo;
    }

    return userMailboxInfoMap.get(userIdentity);
}
