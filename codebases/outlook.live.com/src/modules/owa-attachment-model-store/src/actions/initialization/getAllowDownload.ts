import { isAttachmentOfReferenceType } from 'owa-attachment-type/lib/isAttachmentOfReferenceType';
import getDataProviderInfo from '../../utils/DataProviderInfo/getDataProviderInfo';
import { AttachmentPolicyInfo, AttachmentPolicyLevel } from 'owa-attachment-policy';
import { isBrowserIE } from 'owa-user-agent';
import { isFeatureEnabled } from 'owa-feature-flags';
import type AttachmentType from 'owa-service/lib/contract/AttachmentType';
import type ReferenceAttachment from 'owa-service/lib/contract/ReferenceAttachment';

export default function getAllowDownload(
    attachmentPolicyInfo: AttachmentPolicyInfo,
    attachment: AttachmentType,
    extension: string
): boolean {
    let downloadAllowed =
        attachmentPolicyInfo.level !== AttachmentPolicyLevel.Block &&
        attachmentPolicyInfo.directFileAccessEnabled;
    if (downloadAllowed && isAttachmentOfReferenceType(attachment)) {
        downloadAllowed = isReferenceAttachmentDownloadable(attachment, extension);
    }

    return downloadAllowed;
}

// SafeLink reference attachments wrapps the attachment's URL inside the safelink provider URL.
// The existing getReferenceAttachment call doesn't work with this type of URL. We have bug 3065891 for make this work.
const SAFELINK_KEYWORD: string = 'safelinks.protection.outlook.com';

// The guest invitation is something groups team did when they share a file with an external recipient,
// and that url cannot be downloaded as it goes through multiple redirects in order to access the file.
const GUEST_INVITATION_URL_KEYWORD: string = 'b7780972f918485c8cfc32b1ba7438eb';

function dataProviderSupportDownload(providerType: string): boolean {
    const dataProviderInfo = getDataProviderInfo(providerType);
    return dataProviderInfo?.supportDownload;
}

function mightBeOneNoteNotebook(extension: string, contentType: string): boolean {
    // Notebooks don't have a file extension.
    // If the content type is set to OneNote and no extension, it's a OneNote notebook.
    // If the content type is not set or is set to the default "image/png", it could be an old attachment or is created by another client,
    // so we still need to assume that it's a notebook.
    // [ VSO - 17242 Add contentType property to the files folder for reference attachments.
    // Till then we should explicictly check if its undefined.
    // If its null we are making an assumption that it could be a one note.]
    return (
        !extension &&
        (!contentType || contentType === 'application/onenote' || contentType === 'image/png')
    ); // We set "image/png" as default value in order not to show reference attachment in down-level client
}

export function isReferenceAttachmentDownloadable(
    attachment: ReferenceAttachment,
    extension: string
): boolean {
    if (attachment.AttachLongPathName) {
        const parser = document.createElement('a');
        parser.href = attachment.AttachLongPathName;

        // We need show download for safelink wrapped cloudy attachment when doc-unwrap-safelinks flight is ON.
        // But we have to hide in IE before we fix VSO:86832 since IE's max URL length is 2048.
        if (
            ((!isFeatureEnabled('doc-unwrap-safelinks') || isBrowserIE()) &&
                parser.host.indexOf(SAFELINK_KEYWORD, 0) > 0) ||
            parser.search.indexOf(GUEST_INVITATION_URL_KEYWORD, 0) > 0
        ) {
            return false;
        }
    }

    // VSO - 17242 Add AttachmentIsFolder property to the files folder for reference attachments.
    if (dataProviderSupportDownload(attachment.ProviderType) && !attachment.AttachmentIsFolder) {
        if (extension === '.fluid') {
            return false;
        }

        return !mightBeOneNoteNotebook(extension, attachment.ContentType);
    }

    return false;
}
