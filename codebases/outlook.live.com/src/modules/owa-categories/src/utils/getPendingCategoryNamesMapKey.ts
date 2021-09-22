import { isConnectedAccount } from 'owa-accounts-store';
import type { MailboxInfo } from 'owa-client-ids';

/**
 * Gets the key for the pending category names map
 * @param mailboxInfo the mailboxInfo of the account
 * @param categoryName the category name to add
 * @returns the key for the PendingCategoryNamesMap
 */
export function getPendingCategoryNamesMapKey(
    mailboxInfo: MailboxInfo,
    categoryName: string
): string {
    const emailAddress = mailboxInfo ? mailboxInfo.userIdentity : undefined;
    return emailAddress && isConnectedAccount(emailAddress)
        ? categoryName + '-' + emailAddress
        : categoryName;
}
