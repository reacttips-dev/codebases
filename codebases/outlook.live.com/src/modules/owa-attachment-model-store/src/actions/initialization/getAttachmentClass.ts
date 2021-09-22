import AttachmentClass from '../../store/schema/AttachmentClass';
import getDataProviderInfo from '../../utils/DataProviderInfo/getDataProviderInfo';
import isPdf from '../../utils/isPdf';
import shouldPreviewAudio from '../../utils/shouldPreviewAudio';
import shouldPreviewCalendarAttachment from '../../utils/shouldPreviewCalendarAttachment';
import shouldPreviewEmailAttachment from '../../utils/shouldPreviewEmailAttachment';
import shouldPreviewGoogleDoc from '../../utils/shouldPreviewGoogleDoc';
import shouldPreviewImage from '../../utils/shouldPreviewImage';
import shouldPreviewNativeViewableDocument from '../../utils/shouldPreviewNativeViewableDocument';
import shouldPreviewPdfJs from '../../utils/shouldPreviewPdfJs';
import { isTextFile } from 'owa-file/lib/utils/isTextFile';

import shouldPreviewVideo from '../../utils/shouldPreviewVideo';
import {
    AttachmentPolicyInfo,
    AttachmentPolicyLevel,
    getUserAttachmentPolicyChecker,
} from 'owa-attachment-policy';
import type AttachmentType from 'owa-service/lib/contract/AttachmentType';
import type ReferenceAttachment from 'owa-service/lib/contract/ReferenceAttachment';
import isConsumer from 'owa-session-store/lib/utils/isConsumer';
import { isAttachmentOfReferenceType } from 'owa-attachment-type/lib/isAttachmentOfReferenceType';
import { isAttachmentOfFileType } from 'owa-attachment-type/lib/isAttachmentOfFileType';
import { isAttachmentOfItemIdType } from 'owa-attachment-type/lib/isAttachmentOfItemIdType';
import { isAttachmentOfItemType } from 'owa-attachment-type/lib/isAttachmentOfItemType';
import { isAttachmentOfLinkType } from 'owa-attachment-type/lib/isAttachmentOfLinkType';

function dataProviderSupportPreview(refAttachment: ReferenceAttachment): boolean {
    const dataProviderInfo = getDataProviderInfo(refAttachment.ProviderType);
    return dataProviderInfo && dataProviderInfo.supportPreview(refAttachment, isConsumer());
}

export default function getAttachmentClass(
    attachmentPolicyInfo: AttachmentPolicyInfo,
    attachment: AttachmentType
): AttachmentClass {
    let attachmentClass: AttachmentClass;
    if (isAttachmentOfReferenceType(attachment) || isAttachmentOfLinkType(attachment)) {
        // type is narrowed to LinkAttachment | ReferenceAttachment by type discrimination functions
        const refAttachment = attachment;
        if (!dataProviderSupportPreview(refAttachment)) {
            attachmentClass = AttachmentClass.Default;
        } else if (shouldPreviewImage(attachment)) {
            attachmentClass = attachmentPolicyInfo.directFileAccessEnabled
                ? AttachmentClass.Image
                : AttachmentClass.Default;
        } else if (shouldPreviewGoogleDoc(attachment)) {
            attachmentClass = AttachmentClass.GoogleDoc;
        } else if (shouldPreviewNativeViewableDocument(attachment, true /* isCloudy */)) {
            attachmentClass = attachmentPolicyInfo.directFileAccessEnabled
                ? AttachmentClass.NativeViewableDocument
                : AttachmentClass.Default;
        } else if (attachmentPolicyInfo.useWac) {
            attachmentClass = AttachmentClass.WacViewableDocument;
        } else {
            attachmentClass = AttachmentClass.Default;
        }
    } else if (isAttachmentOfFileType(attachment)) {
        if (attachmentPolicyInfo.level === AttachmentPolicyLevel.Block) {
            attachmentClass = AttachmentClass.Blocked;
        } else if (attachmentPolicyInfo.level === AttachmentPolicyLevel.AccessDisabled) {
            attachmentClass = AttachmentClass.Default;
        } else if (shouldPreviewImage(attachment)) {
            attachmentClass = AttachmentClass.Image;
        } else if (isPdf(attachment)) {
            attachmentClass = getAttachmentClassForPdf(attachmentPolicyInfo, attachment);
        } else if (attachmentPolicyInfo.useWac) {
            attachmentClass = AttachmentClass.WacViewableDocument;
        } else if (shouldPreviewAudio(attachment)) {
            attachmentClass = AttachmentClass.Audio;
        } else if (shouldPreviewEmailAttachment(attachment)) {
            attachmentClass = AttachmentClass.Email;
        } else if (isTextFile(attachment.Name)) {
            attachmentClass = AttachmentClass.Text;
        } else if (shouldPreviewVideo(attachment)) {
            attachmentClass = AttachmentClass.Video;
        } else if (shouldPreviewCalendarAttachment(attachment)) {
            attachmentClass = AttachmentClass.CalendarEvent;
        } else {
            attachmentClass = AttachmentClass.Default;
        }
    } else if (isAttachmentOfItemType(attachment)) {
        attachmentClass = AttachmentClass.ItemAttachment;
    } else if (isAttachmentOfItemIdType(attachment)) {
        attachmentClass = AttachmentClass.ItemIdAttachment;
    } else {
        attachmentClass = AttachmentClass.Default;
    }

    return attachmentClass;
}

function getAttachmentClassForPdf(
    attachmentPolicyInfo: AttachmentPolicyInfo,
    attachment: AttachmentType
): AttachmentClass {
    const attachmentPolicyChecker = getUserAttachmentPolicyChecker();

    if (!attachmentPolicyChecker.isPdfPreviewEnabled()) {
        return AttachmentClass.Blocked;
    } else if (shouldPreviewNativeViewableDocument(attachment, false /* isCloudy */)) {
        return AttachmentClass.NativeViewableDocument;
    } else if (shouldPreviewPdfJs(attachment)) {
        return AttachmentClass.PdfJs;
    } else if (attachmentPolicyInfo.useWac) {
        return AttachmentClass.WacViewableDocument;
    }

    return AttachmentClass.Default;
}
