import doesBrowserSupportModernExtension from './doesBrowserSupportModernExtension';
import isBrowserSupportActiveX from './isBrowserSupportActiveX';
import SmimeInstallationStatus from '../store/schema/SmimeInstallationStatus';
import SmimeType from '../store/schema/SmimeType';
import type AttachmentType from 'owa-service/lib/contract/AttachmentType';
import type {
    ReadOnlyPolicySettingsType,
    ReadOnlySessionSettingsType,
    ReadOnlySmimeAdminSettingsType,
} from 'owa-service/lib/ReadOnlyTypes';
import type SmimeAdminSettingsType from 'owa-service/lib/contract/SmimeAdminSettingsType';
import {
    getBrowserVersion,
    isBrowserChrome,
    isBrowserIE,
    isWindows,
    isBrowserEDGECHROMIUM,
} from 'owa-user-agent';
import {
    COMPATIBILITY_LEVEL_MAJOR,
    COMPATIBILITY_LEVEL_MINOR,
    MINIMUM_IE_VERSION,
    ITEM_CLASS_SMIME_CLEAR_SIGNED,
    PREFIX,
    IMAGE_PREFIX,
} from './constants';
import { ITEM_CLASS_SMIME } from './bootConstants';
import getSmimeAdminSettings from 'owa-session-store/lib/utils/getSmimeAdminSettings';
import { isHostAppFeatureEnabled } from 'owa-hostapp-feature-flags';

export function isSmimeNativeAppInstalledSeparately(): boolean {
    return isBrowserChrome() || isBrowserEDGECHROMIUM();
}

export function isPluginUpToDate(version: string): boolean {
    const versionParts: number[] =
        typeof version === 'string' ? version.split('.').map(x => parseInt(x)) : [];
    return isVersionCompatible(versionParts);
}

export function isForceUpgrade(version: string): boolean {
    const versionParts: string[] = typeof version === 'string' ? version.split('.') : [];
    return versionParts.length && versionParts[0] != COMPATIBILITY_LEVEL_MAJOR;
}

export function isBrowserSupported(): boolean {
    return (
        isWindows() &&
        ((isBrowserIE() &&
            getBrowserVersion()[0] == MINIMUM_IE_VERSION &&
            isBrowserSupportActiveX()) ||
            doesBrowserSupportModernExtension()) &&
        isHostAppFeatureEnabled('smimeExtension')
    );
}

export function isInitialized(installationStatus: SmimeInstallationStatus): boolean {
    return installationStatus !== SmimeInstallationStatus.Unknown;
}

function isVersionCompatible(versionParts: number[]): boolean {
    if (versionParts.length < 2) {
        return false;
    }
    const compareMajor = versionParts[0] - parseInt(COMPATIBILITY_LEVEL_MAJOR);
    const compareMinor = versionParts[1] - parseInt(COMPATIBILITY_LEVEL_MINOR);

    return compareMajor == 0 && compareMinor >= 0;
}

export function getPossibleSmimeCertSubjects(
    sessionSettings: ReadOnlySessionSettingsType
): string[] {
    const certSubjects: string[] = [];
    certSubjects.push(sessionSettings.UserEmailAddress);
    certSubjects.push(sessionSettings.LogonEmailAddress);
    certSubjects.push(sessionSettings.UserPrincipalName);
    certSubjects.push(sessionSettings.UserLegacyExchangeDN);
    const proxyAddresses = sessionSettings.UserProxyAddresses;
    if (proxyAddresses && proxyAddresses.length > 0) {
        proxyAddresses.forEach(function (proxy: string) {
            if (certSubjects.indexOf(proxy) >= 0) {
                return;
            }
            certSubjects.push(proxy);
        });
    }

    return certSubjects;
}

export function calcCodePage(policySettings: ReadOnlyPolicySettingsType): number {
    // Set default code page for the extension
    // The mapping is here: http://msdn.microsoft.com/en-us/library/windows/desktop/dd317756(v=vs.85).aspx
    // Set utf-8 as default
    let codePage: number = 65001;
    if (policySettings.UseGB18030) {
        // GB18030
        codePage = 54936;
    } else if (policySettings.UseISO885915) {
        // ISO-8859-15
        codePage = 28605;
    }

    return codePage;
}

// Gets the S/MIME admin settings required for the extension
export function getAdminSettingsForSmime(
    smimeAdminSettings: ReadOnlySmimeAdminSettingsType
): ReadOnlySmimeAdminSettingsType {
    return {
        AllowUserChoiceOfSigningCertificate: smimeAdminSettings.AllowUserChoiceOfSigningCertificate,
        IncludeCertificateChainWithoutRootCertificate:
            smimeAdminSettings.IncludeCertificateChainWithoutRootCertificate,
        IncludeCertificateChainAndRootCertificate:
            smimeAdminSettings.IncludeCertificateChainAndRootCertificate,
        EncryptTemporaryBuffers: smimeAdminSettings.EncryptTemporaryBuffers,
        SignedEmailCertificateInclusion: smimeAdminSettings.SignedEmailCertificateInclusion,
        IncludeSmimeCapabilitiesInMessage: smimeAdminSettings.IncludeSMIMECapabilitiesInMessage,
        CopyRecipientHeaders: smimeAdminSettings.CopyRecipientHeaders,
        OnlyUseSmartCard: smimeAdminSettings.OnlyUseSmartCard,
        EncryptionAlgorithms: smimeAdminSettings.EncryptionAlgorithms,
        SigningAlgorithms: smimeAdminSettings.SigningAlgorithms,
    } as SmimeAdminSettingsType;
}

/**
 * Returns the ItemClass for S/MIME message item
 * @param shouldSignMessageAsSmime should be true if user has selected the S/MIME sign option in message option dialog
 * @param shouldEncryptMessageAsSmime should be true if user has selected the S/MIME encrypt option in message option dialog
 */
export function getSmimeItemClassFromSelectedMessageOptions(
    shouldSignMessageAsSmime: boolean,
    shouldEncryptMessageAsSmime: boolean
): string {
    const isClearSign = getSmimeAdminSettings().ClearSign;
    return shouldEncryptMessageAsSmime || (shouldSignMessageAsSmime && !isClearSign)
        ? ITEM_CLASS_SMIME
        : ITEM_CLASS_SMIME_CLEAR_SIGNED;
}

/**
 * Converts given string to base-64 format
 * @param data string to convert to base-64 format
 */
export function getBase64Encoded(data: string): string {
    return btoa(unescape(encodeURIComponent(data)));
}

/**
 * Returns the SmimeType based on selected S/MIME message option
 * @param shouldSignMessageAsSmime Status of S/MIME signed message option in Message options dialog in compose
 * @param shouldEncryptMessageAsSmime Status of S/MIME encrypted message option in Message options dialog in compose
 */
export function getSmimeTypeFromSelectedMessageOptions(
    shouldSignMessageAsSmime: boolean,
    shouldEncryptMessageAsSmime: boolean
): SmimeType {
    const smimeAdminSettings = getSmimeAdminSettings();
    if (shouldSignMessageAsSmime && shouldEncryptMessageAsSmime) {
        return smimeAdminSettings.TripleWrapSignedEncryptedMail
            ? SmimeType.TripleWrapped
            : SmimeType.SignedThenEncrypted;
    } else if (!shouldSignMessageAsSmime) {
        return SmimeType.Encrypted;
    }
    return smimeAdminSettings.ClearSign ? SmimeType.ClearSigned : SmimeType.OpaqueSigned;
}

function newRandomId(): string {
    return (Math.floor(Math.random() * 0xefffffff) + 0x10000000).toString(16);
}

export function getIdWithSmimePrefix(tempId?: string): string {
    return PREFIX + (tempId || newRandomId() + newRandomId() + newRandomId() + newRandomId());
}

/**
 * Skip the inline image attachment if its not present in email body
 * @param bodyHTML HTML body of the email message
 * @param attachment Inline image attachment
 */
export function isInvalidInlineAttachment(bodyHTML: string, attachment: AttachmentType): boolean {
    return attachment.IsInline && bodyHTML.indexOf(attachment.ContentId) === -1;
}

/**
 * Returns a random content-id for S/MIME inline image
 */
export function createContentId() {
    // A content id example: image82a346e6@497d822b.7677fbce
    return IMAGE_PREFIX + newRandomId() + '@' + newRandomId() + '.' + newRandomId();
}
