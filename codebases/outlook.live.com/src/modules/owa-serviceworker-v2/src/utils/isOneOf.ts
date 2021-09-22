const networkErrors = [
    'Failed to fetch',
    'AutoCancel',
    'The network connection was lost.',
    'NetworkError when attempting to fetch resource.',
    'cancelled',
    'kCFErrorDomainCFNetwork',
    'The request timed out.',
    'Protocol error',
    'SSL error has occurred',
    'The internet connection appears to be offline.',
];
export function isNetworkError(errorMessage: string | undefined): boolean {
    return isOneOf(networkErrors, errorMessage);
}

const quotaErrors = [
    'Unexpected internal error.',
    'Entry already exists.',
    'Failed writing data to the file system',
    'Internal error',
    'Quota exceeded.',
];
export function isQuotaError(errorMessage: string | undefined): boolean {
    return isOneOf(quotaErrors, errorMessage);
}

function isOneOf(exceptionList: string[], errorMessage: string | undefined): boolean {
    return (
        !!errorMessage &&
        exceptionList.some(
            exception => errorMessage.toLowerCase().indexOf(exception.toLowerCase()) > -1
        )
    );
}
