/**
 * Content type of p7m attachment for clear signed messages
 */
export const MULTIPART_SIGNED_CONTENT_TYPE = 'multipart/signed';

/**
 * Possible content type for S/MIME attachment
 */
export const PKCS_MIME_TYPE = 'application/pkcs7-mime';

/**
 * Possible content type for S/MIME attachment
 */
export const X_PKCS_MIME_TYPE = 'application/x-pkcs7-mime';

/**
 * File extension for p7m package file
 */
export const SMIME_FILE_EXTENSION = '.p7m';

/**
 *  ActiveX Class ID for IE Extension
 */
export const CLASS_ID = 'CLSID:56023A83-B4FC-413B-9285-6BB1DAD977A2';

/**
 * DOM Attribute for ActiveX Object
 */
export const SMIME_DOM_ATTRIBUTE = 'CLASSID';

/**
 * The compatibility level defined in this file should be identical with: sources\dev\clients\src\smime\ActiveX\Constants.cs
 * Changing this value will force all the clients to upgrade for the new DLL.
 */
export const COMPATIBILITY_LEVEL_MAJOR = '4';

/**
 * The compatibility level defined in this file should be identical with: sources\dev\clients\src\smime\ActiveX\Constants.cs  (in Utah branch)
 * Increment when internal changes are made that don't effect communications with OWA or the server.
 * Changing this value will make OWA display a message that the DLL is out of date.
 */
export const COMPATIBILITY_LEVEL_MINOR = '0800';

/**
 * The minimum version of the chrome browser supported by S/MIME control.
 */
export const MINIMUM_CHROME_VERSION = 57;

/**
 * The minimum version of the edge chromium browser supported by S/MIME control.
 */
export const MINIMUM_EDGE_CHROMIUM_VERSION = 78;

/**
 * The minimum version of the edge browser supported by S/MIME control.
 */
export const MINIMUM_EDGE_VERSION = 16;

/**
 * The minimum version of the ie browser supported by S/MIME control.
 */
export const MINIMUM_IE_VERSION = 11;

/**
 * ItemClass for Clear signed messages
 */
export const ITEM_CLASS_SMIME_CLEAR_SIGNED = 'IPM.Note.SMIME.MultipartSigned';

/**
 * Item class for encrypted, encrypted and signed S/MIME message
 * Please see ./bootConstants
 */
// export const ITEM_CLASS_SMIME = 'IPM.Note.SMIME';

/**
 *  The ID prefix of items or attachments constructed by S/MIME control. The format of the ID is "smime-GUID"
 */
export const PREFIX = 'smime-';

/**
 *  The ID prefix of inline images constructed by S/MIME control. The format of the ID is "imageGUID@GUID.GUID"
 */
export const IMAGE_PREFIX = 'image';

/**
 * Event name from Owa To Smime control in Chrome/Edge
 */
export const OWA_PAGE_TO_SMIME_EXTENSION_EVENT_NAME: string = 'OwaToSmime';

/**
 * Event name from Smime To Owa control in Chrome/Edge
 */
export const SMIME_EXTENSION_TO_OWA_PAGE_EVENT_NAME: string = 'SmimeToOwa';

/**
 * S/MIME Default Culture
 */
export const SMIME_DEFAULT_CULTURE = 'en-US';

/**
 * S/MIME Setting fields that are not PII
 */
export const SMIME_SETTINGS_NON_PII_FIELDS = [
    'Culture',
    'CodePage',
    'AttachmentSizeLimit',
    'UseKeyIdentifier',
    'AllowUserChoiceOfSigningCertificate',
    'IncludeCertificateChainWithoutRootCertificate',
    'IncludeCertificateChainAndRootCertificate',
    'EncryptTemporaryBuffers',
    'SignedEmailCertificateInclusion',
    'IncludeSmimeCapabilitiesInMessage',
    'CopyRecipientHeaders',
    'OnlyUseSmartCard',
    'EncryptionAlgorithms',
    'SigningAlgorithms',
    'AlwaysEncrypt',
    'AlwaysSign',
    'TripleWrapSignedEncryptedMail',
    'BccEncryptedEmailForking',
];

/**
 * Name of the Edge extension
 */
export const SMIME_EDGE_EXTENSION_NAME = 'OwaSmimeEdgeExtension.appxbundle';

/**
 * S/MIME edge chromium extension installer url
 */
export const SMIME_EDGE_CHROMIUM_EXTENSION_URL =
    'https://microsoftedge.microsoft.com/addons/detail/gamjhjfeblghkihfjdpmbpajhlpmobbp';

/**
 * S/MIME extension options page URL for chrome
 */
export const SMIME_CHROME_EXTENSION_OPTIONS_URL =
    'chrome-extension://maafgiompdekodanheihhgilkjchcakm/Options.html';
