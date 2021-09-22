import type { AttachmentPolicyInfoBarId } from 'owa-attachment-policy-access-issue-checker';
export type InfoBarMessageId =
    /* WASCL related messages */
    | 'errorMessageAccountSuspend'
    | 'errorMessageAccountSuspendShowTierUpgrade'
    | 'errorMessageExceededHourlyMessageLimit'
    | 'errorMessageExceededMaxRecipientLimit'
    | 'errorMessageExceededMaxRecipientLimitShowTierUpgrade'
    | 'errorMessageExceededMessageLimit'
    | 'errorMessageExceededMessageLimitShowTierUpgrade'
    | 'errorMessageMessageSubmissionBlocked'
    | 'errorMessageMessageBlocked'
    | 'errorMessageTimeout'
    | 'errorMessageThrottled'
    | 'errorMessageTransientError'

    /* The message can't be saved or sent because the item is no longer existed*/
    | 'errorMessageItemNoLongerExistToSave'
    | 'errorMessageItemNoLongerExistToSend'

    /* Send/Save failure for mailbox full case */
    | 'errorMessageQuotaExceededMessageCanNotBeSaved'
    | 'errorMessageQuotaExceededMessageCanNotBeSent'

    /* specific message for the throttling policy case, i.e. when daily RecipientRateLimit is exceeded */
    | 'errorMessageSubmissionQuotaExceededMessageCanNotBeSent'

    /* misc */
    | 'errorMessageMessageCanNotBeSaved'
    | 'errorMessageMessageCanNotBeSent'
    | 'errorMessageNoPermissionToSendAs'
    | 'errorMessageNoRecipentsMailCanNotBeSend'
    | 'errorMessageInvalidSenderMailCanNotBeSend'
    | 'errorMessageFileCanNotBeSaved'
    | 'warningMessageMaxRecipientsExceed'
    | 'warningMessageNoPermissionToPerformAction'
    | 'warningNoQuotedBody'
    | 'warningFailureToShowOriginalMessage'
    | 'error500'
    | 'error503'
    | 'errorFailedToFetch'
    | 'errorSessionTimeout'
    | 'errorMailboxStoreUnavailable'
    | 'errorMessageErrorWithDetail'

    /* DLP policy tips */
    | 'dlpPolicyTips'

    /* attachment policy */
    | AttachmentPolicyInfoBarId.ReadOnlyAccess
    | AttachmentPolicyInfoBarId.ReadOnlyPlusAttachmentsBlockedAccess

    /* S/MIME errors*/
    | 'smimeEncodeError';

export const sendAndSaveInfobarIdsToRemove = [
    /* WASCL related messages */
    'errorMessageAccountSuspend',
    'errorMessageAccountSuspendShowTierUpgrade',
    'errorMessageExceededHourlyMessageLimit',
    'errorMessageExceededMaxRecipientLimit',
    'errorMessageExceededMaxRecipientLimitShowTierUpgrade',
    'errorMessageExceededMessageLimit',
    'errorMessageExceededMessageLimitShowTierUpgrade',
    'errorMessageMessageSubmissionBlocked',
    'errorMessageMessageBlocked',
    'errorMessageTimeout',
    'errorMessageThrottled',
    'errorMessageTransientError',

    /* The message can't be saved or sent because the item is no longer existed*/
    'errorMessageItemNoLongerExistToSave',
    'errorMessageItemNoLongerExistToSend',

    /* Send/Save failure for mailbox full case */
    'errorMessageQuotaExceededMessageCanNotBeSaved',
    'errorMessageQuotaExceededMessageCanNotBeSent',

    /* specific message for the throttling policy case, i.e. when daily RecipientRateLimit is exceeded */
    'errorMessageSubmissionQuotaExceededMessageCanNotBeSent',

    /* misc */
    'errorMessageMessageCanNotBeSaved',
    'errorMessageMessageCanNotBeSent',
    'errorMessageNoPermissionToSendAs',
    'errorMessageNoRecipentsMailCanNotBeSend',
    'errorMessageInvalidSenderMailCanNotBeSend',
    'warningMessageNoPermissionToPerformAction',
    'error500',
    'error503',
    'errorFailedToFetch',
    'errorSessionTimeout',
    'errorMailboxStoreUnavailable',
    'errorMessageErrorWithDetail',

    /* S/MIME errors*/
    'smimeEncodeError',
    'smimeBccForkingFailedError',
];
