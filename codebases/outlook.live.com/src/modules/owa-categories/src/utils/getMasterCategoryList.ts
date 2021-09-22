import type { MailboxInfo } from 'owa-client-ids';
import getUserConfiguration from 'owa-session-store/lib/actions/getUserConfiguration';
import { isConnectedAccount } from 'owa-accounts-store';
import { getUserConfigurationForUser } from 'owa-session-store';
import type CategoryType from 'owa-service/lib/contract/CategoryType';

/**
 * Gets the MasterCategoryList for the given mailboxInfo. This will be different from the
 * default MasterCategoryList for a connected account since the userConfiguration is different.
 * @param mailboxInfo The mailbox to fetch the user configuration for
 */
export default function getMasterCategoryList(mailboxInfo?: MailboxInfo): CategoryType[] {
    let userConfiguration;

    if (mailboxInfo && isConnectedAccount(mailboxInfo.userIdentity)) {
        userConfiguration = getUserConfigurationForUser(mailboxInfo.userIdentity);
    } else {
        userConfiguration = getUserConfiguration();
    }

    let masterCategoryList = userConfiguration?.MasterCategoryList;

    // the MasterCategoryList can be null for shared mailboxes
    return masterCategoryList?.MasterList || [];
}
