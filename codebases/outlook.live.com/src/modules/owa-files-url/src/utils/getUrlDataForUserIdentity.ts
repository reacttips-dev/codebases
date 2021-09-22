import { getOWAAccountProvider, AccountProviderType } from 'owa-accounts-store';
import type { FilesUrlData } from '../schema/FilesUrlData';
import { updateUrlData } from './updateUrlData';
import { assertNever } from 'owa-assert';
import { getFilesUrlDataByUserIdentity } from './filesUrlDataUtils';
import type { MailboxInfo } from 'owa-client-ids';
import { logUsage } from 'owa-analytics';
import { trace } from 'owa-trace';

/**
 * Based on user identity retrive the correct url data
 */
export function getUrlDataForUserIdentity(mailboxInfo: MailboxInfo): FilesUrlData | undefined {
    const accountProviderType: AccountProviderType | null = getOWAAccountProvider(
        mailboxInfo?.userIdentity
    );
    const urlCachedData: FilesUrlData = getFilesUrlDataByUserIdentity(mailboxInfo?.userIdentity);

    // check if the data in cache
    if (urlCachedData?.downloadToken && urlCachedData?.downloadUrlBase) {
        return urlCachedData;
    }

    switch (accountProviderType) {
        case null: // null currently represent primary account
        case 'Outlook':
            updateUrlData(mailboxInfo);
            break;
        case 'Google':
        case 'ICloud':
            break;
        // Google and ICloud currently not supporting classic attachments in calendar
        default:
            assertNever(accountProviderType);
    }

    const filesUrlData = getFilesUrlDataByUserIdentity(mailboxInfo.userIdentity);
    if (!filesUrlData) {
        logUsage('FilesUrlDataNotFound', { accountProviderType: accountProviderType });
        trace.warn('Unable to get the url data');
    }

    return filesUrlData;
}

export function getDownloadTokenForUserIdentity(
    mailboxInfo: MailboxInfo
): string | undefined | null {
    if (!mailboxInfo) {
        return null;
    }

    const urlData = getUrlDataForUserIdentity(mailboxInfo);
    return urlData?.downloadToken;
}
