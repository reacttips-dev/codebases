/**
 * Header sent with getItem and getFileAttachment calls to indicate the presence of S/MIME controls on client
 */
export const SMIME_INSTALLED_HEADER_KEY = 'X-OWA-SmimeInstalled';

/**
 * X-OWA-SmimeInstalled is 1 when the S/MIME control is installed
 */
export const SMIME_INSTALLED_HEADER_TRUE = '1';

/**
 * Query param on getFileAttachment calls to  request p7m package as text rather than IStream
 */
export const SMIME_WITHOUT_ACTIVEX_PARAM = 'SmimeWithoutActiveX';

/**
 * S/MIME Control missing
 */
export const SMIME_CONTROL_MISSING = 'Missing_Control';

/**
 * Content type of MailItem attachments
 */
export const MAIL_ITEM_CONTENT_TYPE = 'message/rfc822';

/**
 * MessageId passed when Cancel is clicked on missing encryption certificates dialog.
 */
export const CANCEL_SMIME_SEND_ERROR_MESSAGE = 'ErrorSmimeSendCancelled';
