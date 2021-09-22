// Add the message ids here for the list of messages that
// need to cleared when clearning all attachment info bar messages
export const attachmentInfoBarMessageIds = [
    'ErrorTooLargeForLocalAttachmentSingle',
    'ErrorTooLargeForLocalAttachmentMultiple',
    'WarningFilesCanNotBeAttachedGenericError',
    'WarningEmptyFilesCanNotBeAttached',
    'WarningFilesCanNotBeAttachedWithNamesGenericError',
    'WarningFilesCannotBeAttachedFromOtherMailboxes',
    'WarningSeveralFilesCanNotBeAttachedGenericError',
    'WarningInlineImageTypeNotSupported',
    'WarningAttachmentsCanNotBeDeleted',
    'InfoIncludeMostRecentAttachmentsMessage',
    'ErrorSmimeHasCloudOrUriAttachments',
    'ErrorAttachmentDownloadFailed',
    'ErrorAttachmentDownloadFailedMultipleFiles',
    'WarningSpecialCharactersAreNotSupported',
];

export type AttachmentInfoBarMessageId =
    | 'ErrorTooLargeForLocalAttachmentSingle'
    | 'ErrorTooLargeForLocalAttachmentMultiple'
    | 'WarningFilesCanNotBeAttachedGenericError'
    | 'WarningEmptyFilesCanNotBeAttached'
    | 'WarningFilesCanNotBeAttachedWithNamesGenericError'
    | 'WarningFilesCannotBeAttachedFromOtherMailboxes'
    | 'WarningSeveralFilesCanNotBeAttachedGenericError'
    | 'WarningInlineImageTypeNotSupported'
    | 'WarningAttachmentsCanNotBeDeleted'
    | 'WarningNoPermissionToShare'
    | 'InfoIncludeMostRecentAttachmentsMessage'
    | 'ErrorSmimeHasCloudOrUriAttachments'
    | 'ErrorAttachmentDownloadFailed'
    | 'ErrorAttachmentDownloadFailedMultipleFiles'
    | 'WarningSpecialCharactersAreNotSupported';
