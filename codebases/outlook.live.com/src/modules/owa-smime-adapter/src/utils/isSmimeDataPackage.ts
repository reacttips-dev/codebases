import type AttachmentType from 'owa-service/lib/contract/AttachmentType';
import {
    MULTIPART_SIGNED_CONTENT_TYPE,
    PKCS_MIME_TYPE,
    SMIME_FILE_EXTENSION,
    X_PKCS_MIME_TYPE,
} from './constants';

const startsWith = (haystack: string, needle: string) =>
    haystack.substring(0, needle.length) === needle;

const endsWith = (haystack: string, needle: string) =>
    haystack.substring(haystack.length - needle.length) === needle;

/**
 * Used for Encrypted and Opaque signed scenario
 */
export const hasPKCSContentType = (attachment: AttachmentType): boolean =>
    attachment.ContentType &&
    (startsWith(attachment.ContentType, X_PKCS_MIME_TYPE) ||
        startsWith(attachment.ContentType, PKCS_MIME_TYPE));

/**
 *
 * Used for clearSigned scenario
 */
export const hasSignedContentType = (attachment: AttachmentType): boolean =>
    attachment.ContentType && attachment.ContentType === MULTIPART_SIGNED_CONTENT_TYPE;

/**
 * Returns true if the attachment is a S/MIME data package
 */
export default function isSmimeDataPackage(attachment: AttachmentType): boolean {
    return (
        attachment?.Name &&
        endsWith(attachment.Name, SMIME_FILE_EXTENSION) &&
        (hasPKCSContentType(attachment) || hasSignedContentType(attachment))
    );
}
