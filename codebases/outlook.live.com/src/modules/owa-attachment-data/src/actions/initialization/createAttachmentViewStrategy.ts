import AttachmentOpenAction from '../../schema/AttachmentOpenAction';
import AttachmentPreviewMethod from '../../schema/AttachmentPreviewMethod';
import type AttachmentViewStrategy from '../../schema/AttachmentViewStrategy';
import { AttachmentClass, isSmimeAttachmentType } from 'owa-attachment-model-store';
import { getTypeOfAttachment, TypeOfAttachment } from 'owa-attachment-type';
import { isAttachmentOfLinkType } from 'owa-attachment-type/lib/isAttachmentOfLinkType';
import { isAttachmentOfReferenceType } from 'owa-attachment-type/lib/isAttachmentOfReferenceType';
import type { AttachmentPolicyInfo } from 'owa-attachment-policy';
import type AttachmentType from 'owa-service/lib/contract/AttachmentType';

function isCloudyAttachmentOrLink(attachment: AttachmentType) {
    return isAttachmentOfLinkType(attachment) || isAttachmentOfReferenceType(attachment);
}

export function createAttachmentViewStrategy(
    attachmentPolicyInfo: AttachmentPolicyInfo,
    attachmentClass: AttachmentClass,
    attachment: AttachmentType,
    treatLinksAsAttachments: boolean
): AttachmentViewStrategy {
    // We do a prior check for S/MIME decoded attachments otherwise every case
    // in the switch would need to consider this scenario. S/MIME decode attachments
    // are of same type as normal attachments, so we can't add a new AttachmentClass for them
    if (isSmimeAttachmentType(attachment)) {
        return createSmimeAttachmentStrategy(attachment);
    }

    // For links we will have as a generic reference attachment strategy for now
    // that we will open in a new tab
    if (getTypeOfAttachment(attachment) === TypeOfAttachment.Link && !treatLinksAsAttachments) {
        return createReferenceGenericAttachmentStrategy();
    }

    let strategy: AttachmentViewStrategy;
    switch (attachmentClass) {
        case AttachmentClass.Image:
            strategy = createImageAttachmentStrategy();
            break;
        case AttachmentClass.NativeViewableDocument:
            strategy = createNativeViewableAttachmentStrategy();
            break;
        case AttachmentClass.GoogleDoc:
            strategy = createGoogleDocAttachmentStrategy();
            break;
        case AttachmentClass.WacViewableDocument:
            strategy = createWacViewableAttachmentStrategy(attachmentPolicyInfo);
            break;
        case AttachmentClass.Audio:
            strategy = createAudioAttachmentStrategy();
            break;
        case AttachmentClass.PdfJs:
            strategy = createPdfJsAttachmentStrategy();
            break;
        case AttachmentClass.ItemAttachment:
        case AttachmentClass.ItemIdAttachment:
        case AttachmentClass.Email:
            strategy = createItemAttachmentStrategy();
            break;
        case AttachmentClass.Text:
            strategy = createTextAttachmentStrategy();
            break;
        case AttachmentClass.Video:
            strategy = createVideoAttachmentStrategy();
            break;
        case AttachmentClass.Blocked:
            strategy = createBlockedAttachmentStrategy();
            break;
        case AttachmentClass.CalendarEvent:
            strategy = createICalendarAttachmentStrategy();
            break;
        default:
            if (isCloudyAttachmentOrLink(attachment)) {
                strategy = createReferenceGenericAttachmentStrategy();
            } else {
                strategy = createClassicGenericAttachmentStrategy();
            }
            break;
    }

    return strategy;
}

function createSmimeAttachmentStrategy(attachment: AttachmentType) {
    return getTypeOfAttachment(attachment) === TypeOfAttachment.Mail
        ? createItemAttachmentStrategy()
        : createClassicGenericAttachmentStrategy();
}

function createClassicGenericAttachmentStrategy(): AttachmentViewStrategy {
    return {
        allowEdit: false,
        previewMethod: AttachmentPreviewMethod.Unsupported,
        supportedOpenActions: [AttachmentOpenAction.Download],
    };
}

function createReferenceGenericAttachmentStrategy(): AttachmentViewStrategy {
    return {
        allowEdit: false,
        previewMethod: AttachmentPreviewMethod.Unsupported,
        supportedOpenActions: [AttachmentOpenAction.OpenInNewTab],
    };
}

function createBlockedAttachmentStrategy(): AttachmentViewStrategy {
    return {
        allowEdit: false,
        previewMethod: AttachmentPreviewMethod.Unsupported,
        supportedOpenActions: [],
    };
}

function createImageAttachmentStrategy(): AttachmentViewStrategy {
    return {
        allowEdit: false,
        previewMethod: AttachmentPreviewMethod.Image,
        supportedOpenActions: [AttachmentOpenAction.Preview, AttachmentOpenAction.Download],
    };
}

function createNativeViewableAttachmentStrategy(): AttachmentViewStrategy {
    return {
        allowEdit: false,
        previewMethod: AttachmentPreviewMethod.NativeView,
        supportedOpenActions: [AttachmentOpenAction.Preview, AttachmentOpenAction.Download],
    };
}

function createGoogleDocAttachmentStrategy(): AttachmentViewStrategy {
    return {
        allowEdit: false,
        previewMethod: AttachmentPreviewMethod.GoogleDoc,
        supportedOpenActions: [AttachmentOpenAction.Preview],
    };
}

function createWacViewableAttachmentStrategy(
    policyInfo: AttachmentPolicyInfo
): AttachmentViewStrategy {
    return {
        allowEdit: policyInfo.wacEdit,
        previewMethod: AttachmentPreviewMethod.Wac,
        supportedOpenActions: [AttachmentOpenAction.Preview, AttachmentOpenAction.Download],
    };
}

function createAudioAttachmentStrategy(): AttachmentViewStrategy {
    return {
        allowEdit: false,
        previewMethod: AttachmentPreviewMethod.Audio,
        supportedOpenActions: [AttachmentOpenAction.Preview, AttachmentOpenAction.Download],
    };
}

function createPdfJsAttachmentStrategy(): AttachmentViewStrategy {
    return {
        allowEdit: false,
        previewMethod: AttachmentPreviewMethod.PdfJs,
        supportedOpenActions: [AttachmentOpenAction.Preview],
    };
}

function createItemAttachmentStrategy(): AttachmentViewStrategy {
    return {
        allowEdit: false,
        previewMethod: AttachmentPreviewMethod.ItemAttachment,
        supportedOpenActions: [AttachmentOpenAction.Preview, AttachmentOpenAction.Download],
    };
}

function createTextAttachmentStrategy(): AttachmentViewStrategy {
    return {
        allowEdit: false,
        previewMethod: AttachmentPreviewMethod.Text,
        supportedOpenActions: [AttachmentOpenAction.Preview, AttachmentOpenAction.Download],
    };
}

function createVideoAttachmentStrategy(): AttachmentViewStrategy {
    return {
        allowEdit: false,
        previewMethod: AttachmentPreviewMethod.Video,
        supportedOpenActions: [AttachmentOpenAction.Preview, AttachmentOpenAction.Download],
    };
}

function createICalendarAttachmentStrategy(): AttachmentViewStrategy {
    return {
        allowEdit: false,
        previewMethod: AttachmentPreviewMethod.CalendarEvent,
        supportedOpenActions: [AttachmentOpenAction.Preview, AttachmentOpenAction.Download],
    };
}
