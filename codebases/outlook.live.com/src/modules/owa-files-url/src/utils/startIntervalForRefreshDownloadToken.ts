import { saveUrlData, getFilesUrlDataByUserIdentity } from './filesUrlDataUtils';
import getAttachmentDownloadToken from 'owa-service/lib/operation/getAttachmentDownloadTokenOperation';
import { DatapointStatus, VerboseDatapoint } from 'owa-analytics';
import { trace, TraceErrorObject } from 'owa-trace';
import { createRetriableFunction } from 'owa-retriable-function';
import type { MailboxInfo } from 'owa-client-ids';
import { getConnectedAccountHeadersForUserIdentity } from './getConnectedAccountHeadersForUserIdentity';
import type RequestOptions from 'owa-service/lib/RequestOptions';
import { isConnectedAccount } from 'owa-accounts-store';

const TIME_TO_WAIT_BEFORE_REFRESHING_TOKEN_IN_CASE_OF_ERROR_IN_MS = 1000 * 30; // 30 Seconds

// This will retry indefinitely and will wait 30 seconds between each retry
const createRetriableForRefreshingToken = createRetriableFunction({
    timeBetweenRetryInMS: () => TIME_TO_WAIT_BEFORE_REFRESHING_TOKEN_IN_CASE_OF_ERROR_IN_MS,
});

export async function refreshDownloadTokenAndRetryInCaseOfFailure(mailboxInfo: MailboxInfo) {
    const refreshDownloadToken = async (): Promise<string> => {
        try {
            let requestOptions: RequestOptions = {};
            if (isConnectedAccount(mailboxInfo.userIdentity)) {
                requestOptions = await getConnectedAccountHeadersForUserIdentity(
                    mailboxInfo.userIdentity
                );
            }
            return getAttachmentDownloadToken(requestOptions);
        } catch (error) {
            trace.warn(`Unable to get the download token ${error}`);
            (error as TraceErrorObject).networkError = true;
            throw error;
        }
    };

    const urlData = getFilesUrlDataByUserIdentity(mailboxInfo.userIdentity);

    if (!urlData?.isRefreshingDownloadToken) {
        saveUrlData(mailboxInfo.userIdentity, {
            isRefreshingDownloadToken: true,
        });

        let totalTries = 0;
        const { retriableFunc } = createRetriableForRefreshingToken(async () => {
            totalTries++;

            const token = await refreshDownloadToken();
            trace.info('update new token');
            saveUrlData(mailboxInfo.userIdentity, {
                downloadToken: token,
                isRefreshingDownloadToken: false,
            });
        });
        const performanceDatapoint = new VerboseDatapoint('AttachmentRefreshDownloadToken');

        try {
            await retriableFunc();
            performanceDatapoint.addCustomData([totalTries]);
            performanceDatapoint.end();
        } catch (error) {
            trace.warn(`Retry to refresh token failed: ${error}`);
            performanceDatapoint.addCustomData([totalTries]);
            performanceDatapoint.endWithError(DatapointStatus.ServerError, error);

            saveUrlData(mailboxInfo.userIdentity, {
                isRefreshingDownloadToken: false,
            });
        }
    }
}

export function startIntervalForRefreshDownloadToken(
    mailboxInfo: MailboxInfo,
    downloadTokenRefreshMinutes: number
): void {
    downloadTokenRefreshMinutes = downloadTokenRefreshMinutes < 1 ? 1 : downloadTokenRefreshMinutes;

    setInterval(() => {
        refreshDownloadTokenAndRetryInCaseOfFailure(mailboxInfo);
    }, 1000 * 60 * downloadTokenRefreshMinutes);
}
