import type { InfoBarMessageId } from './InfoBarMessageId';

export default function getErrorMessageFromResponseCode(
    responseCode: string,
    isSend: boolean
): InfoBarMessageId {
    if (responseCode) {
        if (responseCode.indexOf('500') >= 0) {
            return 'error500';
        } else if (responseCode.indexOf('503') >= 0) {
            return 'error503';
        } else if (responseCode.indexOf('Failed to fetch') >= 0) {
            return 'errorFailedToFetch';
        }
    }
    switch (responseCode) {
        case 'ErrorSessionTimeout':
            return 'errorSessionTimeout';
        case 'ErrorMailboxStoreUnavaiable':
            return 'errorMailboxStoreUnavailable';
        case 'ErrorSendAsDenied':
            return 'errorMessageNoPermissionToSendAs';
        case 'ErrorRightsManagementPermanentException':
            // TODO: TryParseLowLevelError(Exception exception, out InfoBarMessageId infoBarMessageId)
            return null;
        case 'ErrorSubmissionQuotaExceeded':
            return 'errorMessageSubmissionQuotaExceededMessageCanNotBeSent';
        case 'ErrorAccountSuspend':
            return 'errorMessageAccountSuspend';
        case 'ErrorExceededMaxRecipientLimit':
            return 'errorMessageExceededMaxRecipientLimit';
        case 'ErrorExceededMessageLimit':
            return 'errorMessageExceededMessageLimit';
        case 'ErrorExceededHourlyMessageLimit':
            return 'errorMessageExceededHourlyMessageLimit';
        case 'ErrorMessageBlocked':
            return 'errorMessageMessageBlocked';
        case 'ErrorMessageSubmissionBlocked':
            return 'errorMessageMessageSubmissionBlocked';
        case 'ErrorAccountSuspendShowTierUpgrade':
            return 'errorMessageAccountSuspendShowTierUpgrade';
        case 'ErrorExceededMaxRecipientLimitShowTierUpgrade':
            return 'errorMessageExceededMaxRecipientLimitShowTierUpgrade';
        case 'ErrorExceededMessageLimitShowTierUpgrade':
            return 'errorMessageExceededMessageLimitShowTierUpgrade';
        case 'ErrorMessageTimeout':
            return 'errorMessageTimeout';
        case 'ErrorMessageThrottled':
            return 'errorMessageThrottled';
        case 'ErrorMessageTransientError':
            return 'errorMessageTransientError';
        case 'ErrorItemNotFound':
            if (isSend) {
                return 'errorMessageItemNoLongerExistToSend';
            } else {
                return 'errorMessageItemNoLongerExistToSave';
            }
        case 'ErrorAccessDenied':
            return 'warningMessageNoPermissionToPerformAction';
        case 'SmimeEncodeError':
            return 'smimeEncodeError';
        case 'ErrorQuotaExceeded':
            if (isSend) {
                return 'errorMessageQuotaExceededMessageCanNotBeSent';
            } else {
                return 'errorMessageQuotaExceededMessageCanNotBeSaved';
            }
        default:
            if (isSend) {
                return 'errorMessageMessageCanNotBeSent';
            } else {
                return 'errorMessageMessageCanNotBeSaved';
            }
    }
}
