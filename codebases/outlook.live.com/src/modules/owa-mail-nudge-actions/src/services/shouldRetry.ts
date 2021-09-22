import isRetriableStatus from 'owa-service/lib/isRetriableStatus';

/**
 * Returns flag indicating whether to retry.
 * @param errorOrStatus string containing status code or error message
 */
export function shouldRetry(errorOrStatus: string): boolean {
    const status = parseInt(errorOrStatus) || -1;
    const isRetryStatus =
        (status != -1 && isRetriableStatus(status)) || status == 503; /* Service unavailable */
    return isRetryStatus || status == -1;
}
