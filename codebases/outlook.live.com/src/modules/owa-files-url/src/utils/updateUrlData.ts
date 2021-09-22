import { saveUrlData } from '../utils/filesUrlDataUtils';
import { getUserConfigurationForUser, getUserConfiguration } from 'owa-session-store';
import { startIntervalForRefreshDownloadToken } from '../utils/startIntervalForRefreshDownloadToken';
import type { MailboxInfo } from 'owa-client-ids';
import { isConnectedAccount } from 'owa-accounts-store';

export function updateUrlData(mailboxInfo: MailboxInfo): void {
    const isAConnectedAccount = isConnectedAccount(mailboxInfo.userIdentity);
    const userConfiguration = isAConnectedAccount
        ? getUserConfigurationForUser(mailboxInfo.userIdentity)
        : getUserConfiguration();

    const applicationSettings = userConfiguration?.ApplicationSettings;
    if (applicationSettings) {
        const downloadUrlBase = applicationSettings.DownloadUrlBase;
        saveUrlData(mailboxInfo.userIdentity, {
            downloadUrlBase,
            downloadToken: applicationSettings.FirstDownloadToken,
        });

        if (!!downloadUrlBase) {
            startIntervalForRefreshDownloadToken(
                mailboxInfo,
                applicationSettings.DownloadTokenRefreshMinutes
            );
        }
    }
}
