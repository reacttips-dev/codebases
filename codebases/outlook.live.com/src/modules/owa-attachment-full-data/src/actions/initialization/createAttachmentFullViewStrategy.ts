import { isStringNullOrWhiteSpace } from 'owa-localize';
import {
    getIsSaveToCloudSupported,
    AttachmentPolicyChecker,
    AttachmentPolicyInfo,
} from 'owa-attachment-policy';
import type AttachmentFullViewStrategy from '../../schema/AttachmentFullViewStrategy';
import AttachmentMenuAction from '../../schema/AttachmentMenuAction';
import convertMenuOptionToOpenAction from '../../utils/convertMenuOptionToOpenAction';
import convertOpenActionToMenuOption from '../../utils/convertOpenActionToMenuOption';
import getDataProviderInfo, {
    AttachmentDataProviderInfo,
    getDefaultDataProviderInfo,
} from '../../utils/DataProviderInfo/getDataProviderInfo';
import intersectionOfArrays from '../../utils/intersectionOfArrays';
import {
    AttachmentViewStrategy,
    createAttachmentViewStrategy,
    AttachmentOpenAction,
} from 'owa-attachment-data';
import { AttachmentClass } from 'owa-attachment-model-store';
import isConsumer from 'owa-session-store/lib/utils/isConsumer';
import type AttachmentType from 'owa-service/lib/contract/AttachmentType';
import { AccessIssue, getCombinedAccessIssue } from 'owa-attachment-policy-access-issue-checker';
import { isAttachmentOfReferenceType as isCloudyAttachment } from 'owa-attachment-type/lib/isAttachmentOfReferenceType';
import { isAttachmentOfLinkType as isLinkAttachment } from 'owa-attachment-type/lib/isAttachmentOfLinkType';

// Exporting only for testing
export function removeUnsupportedOpenActions(
    strategy: AttachmentViewStrategy,
    supportedMenuActions: AttachmentMenuAction[]
) {
    // Filter conditional access and attachment policy
    const accessIssue: AccessIssue = getCombinedAccessIssue();
    if (accessIssue === AccessIssue.ReadOnly) {
        strategy.supportedOpenActions = strategy.supportedOpenActions.filter(
            action => action !== AttachmentOpenAction.Download
        );
    } else if (accessIssue === AccessIssue.ReadOnlyPlusAttachmentsBlocked) {
        strategy.supportedOpenActions = strategy.supportedOpenActions.filter(
            action =>
                action !== AttachmentOpenAction.Download && action !== AttachmentOpenAction.Preview
        );
    }

    // Map all the open actions to menu actions and remove any nulls
    const supportedOpenActions: AttachmentMenuAction[] = strategy.supportedOpenActions
        .map(convertOpenActionToMenuOption)
        .filter(action => !!action);

    // Get the list of supported menu actions and convert them to open actions
    const result = intersectionOfArrays(supportedOpenActions, supportedMenuActions);
    strategy.supportedOpenActions = result.map(convertMenuOptionToOpenAction);
}

export function createAttachmentFullViewStrategy(
    attachmentPolicyChecker: AttachmentPolicyChecker,
    attachmentPolicyInfo: AttachmentPolicyInfo,
    attachmentClass: AttachmentClass,
    attachment: AttachmentType,
    providerType: string,
    attachmentOriginalUrl: string,
    allowDownload: boolean,
    supportedMenuActions: AttachmentMenuAction[],
    isReadOnly: boolean,
    treatLinksAsAttachments: boolean,
    isSMIMEItem: boolean,
    isProtectedVoiceMail: boolean
): AttachmentFullViewStrategy {
    const attachmentViewStrategy = createAttachmentViewStrategy(
        attachmentPolicyInfo,
        attachmentClass,
        attachment,
        treatLinksAsAttachments
    );

    if (isProtectedVoiceMail) {
        // disable download for protected voice mail
        supportedMenuActions = supportedMenuActions.filter(
            m => m !== AttachmentMenuAction.Download
        );
    }

    removeUnsupportedOpenActions(attachmentViewStrategy, supportedMenuActions);

    const isCloudy = isCloudyAttachment(attachment);
    const isLink = treatLinksAsAttachments && isLinkAttachment(attachment);

    const isSaveToCloudSupported = getIsSaveToCloudSupported(
        attachment,
        isCloudy || isLink,
        isReadOnly,
        isSMIMEItem,
        isProtectedVoiceMail
    );
    const isOpeningInProviderSupported: boolean = getIsOpeningInProviderSupported(isCloudy);
    const isViewingInProviderSupported: boolean = getIsViewingInProviderSupported(
        isCloudy,
        isLink,
        attachmentOriginalUrl
    );

    const isConvertClassicToCloudySupported: boolean = getisConvertClassicToCloudySupported(
        attachmentPolicyChecker,
        isCloudy || isLink,
        isReadOnly
    );
    const isConvertCloudyToClassicSupported: boolean = getisConvertCloudyToClassicSupported(
        attachmentPolicyChecker,
        isCloudy,
        isReadOnly,
        allowDownload,
        providerType
    );

    const isMoveAttachmentToInlineSupported: boolean = getIsMoveAttachmentToInlineSupported(
        attachmentClass,
        isCloudy,
        isLink,
        isReadOnly
    );

    let strategy: AttachmentFullViewStrategy;
    switch (attachmentClass) {
        case AttachmentClass.Image:
        case AttachmentClass.NativeViewableDocument:
        case AttachmentClass.WacViewableDocument:
        case AttachmentClass.Audio:
        case AttachmentClass.PdfJs:
        case AttachmentClass.ItemAttachment:
        case AttachmentClass.ItemIdAttachment:
        case AttachmentClass.Email:
        case AttachmentClass.Text:
        case AttachmentClass.Video:
        case AttachmentClass.CalendarEvent:
            strategy = createAttachmentStrategy(
                attachmentViewStrategy,
                isSaveToCloudSupported,
                isCloudy || isLink,
                isOpeningInProviderSupported,
                isViewingInProviderSupported,
                isConvertClassicToCloudySupported,
                isConvertCloudyToClassicSupported,
                isMoveAttachmentToInlineSupported
            );
            break;
        case AttachmentClass.Blocked:
            strategy = createBlockedAttachmentStrategy(attachmentViewStrategy);
            break;
        default:
            if (isCloudy) {
                strategy = createReferenceGenericAttachmentStrategy(
                    attachmentViewStrategy,
                    isOpeningInProviderSupported,
                    isViewingInProviderSupported,
                    isConvertCloudyToClassicSupported
                );
            } else {
                strategy = createClassicGenericAttachmentStrategy(
                    attachmentViewStrategy,
                    isSaveToCloudSupported,
                    isViewingInProviderSupported,
                    isConvertClassicToCloudySupported
                );
            }
            break;
    }

    strategy.supportedMenuActions = supportedMenuActions;
    return strategy;
}

export function getIsViewingInProviderSupported(
    isCloudy: boolean,
    isLink: boolean,
    attachmentOriginalUrl: string
): boolean {
    if (isCloudy || isLink) {
        // We no longer support view in provider for reference attachments and do not yet support it for links.
        return false;
    } else {
        const isConsumerUser = isConsumer();
        const dataProviderInfo: AttachmentDataProviderInfo = getDefaultDataProviderInfo(
            isConsumerUser
        );

        // We want to show ViewInProvider after the classic attachment is saved to OneDrive.
        // Then users can access it in the data provider.
        return (
            !isStringNullOrWhiteSpace(attachmentOriginalUrl) &&
            (isConsumerUser || dataProviderInfo?.supportViewInProvider)
        );
    }
}

export function getIsOpeningInProviderSupported(isCloudy: boolean) {
    return isCloudy;
}

export function getisConvertClassicToCloudySupported(
    attachmentPolicyChecker: AttachmentPolicyChecker,
    isCloudyOrLink: boolean,
    isReadOnly: boolean
): boolean {
    return attachmentPolicyChecker.convertClassicToCloudyEnabled && !isCloudyOrLink && !isReadOnly;
}

export function getisConvertCloudyToClassicSupported(
    attachmentPolicyChecker: AttachmentPolicyChecker,
    isCloudy: boolean,
    isReadOnly: boolean,
    allowDownload: boolean,
    providerType: string
): boolean {
    // allowDownload would filter out folder and ReferenceOneNoteNotebook
    if (
        attachmentPolicyChecker.convertCloudyToClassicEnabled &&
        isCloudy &&
        !isReadOnly &&
        allowDownload
    ) {
        const dataProviderInfo: AttachmentDataProviderInfo = getDataProviderInfo(providerType);
        return dataProviderInfo?.supportConvertCloudyToClassic || false;
    }

    return false;
}

function getIsMoveAttachmentToInlineSupported(
    attachmentClass: AttachmentClass,
    isCloudy: boolean,
    isLink: boolean,
    isReadOnly: boolean
): boolean {
    // Attachment must be a non-cloudy image in Compose (not read-only).
    return attachmentClass === AttachmentClass.Image && !isCloudy && !isLink && !isReadOnly;
}

function createClassicGenericAttachmentStrategy(
    attachmentViewStrategy: AttachmentViewStrategy,
    isSaveToCloudSupported: boolean,
    isViewingInProviderSupported: boolean,
    isConvertClassicToCloudySupported: boolean
): AttachmentFullViewStrategy {
    return {
        ...attachmentViewStrategy,
        isSaveToCloudSupported: isSaveToCloudSupported,
        isViewingInProviderSupported: isViewingInProviderSupported,
        isOpeningInProviderSupported: false,
        isOpeningByLinkSupported: false,
        isConvertClassicToCloudySupported: isConvertClassicToCloudySupported,
        isConvertCloudyToClassicSupported: false,
        isMoveAttachmentToInlineSupported: false,
        showActionsMenu: true,
        supportedMenuActions: [],
    };
}

function createReferenceGenericAttachmentStrategy(
    attachmentViewStrategy: AttachmentViewStrategy,
    isOpeningInProviderSupported: boolean,
    isViewingInProviderSupported: boolean,
    isConvertCloudyToClassicSupported: boolean
): AttachmentFullViewStrategy {
    return {
        ...attachmentViewStrategy,
        isSaveToCloudSupported: false,
        isOpeningByLinkSupported: true,
        isOpeningInProviderSupported: isOpeningInProviderSupported,
        isViewingInProviderSupported: isViewingInProviderSupported,
        isConvertClassicToCloudySupported: false,
        isConvertCloudyToClassicSupported: isConvertCloudyToClassicSupported,
        isMoveAttachmentToInlineSupported: false,
        showActionsMenu: true,
        supportedMenuActions: [],
    };
}

function createBlockedAttachmentStrategy(
    attachmentViewStrategy: AttachmentViewStrategy
): AttachmentFullViewStrategy {
    return {
        ...attachmentViewStrategy,
        isSaveToCloudSupported: false,
        isOpeningByLinkSupported: false,
        isOpeningInProviderSupported: false,
        isViewingInProviderSupported: false,
        isConvertClassicToCloudySupported: false,
        isConvertCloudyToClassicSupported: false,
        isMoveAttachmentToInlineSupported: false,
        showActionsMenu: false,
        supportedMenuActions: [],
    };
}

function createAttachmentStrategy(
    attachmentViewStrategy: AttachmentViewStrategy,
    isSaveToCloudSupported: boolean,
    isCloudyOrLink: boolean,
    isOpeningInProviderSupported: boolean,
    isViewingInProviderSupported: boolean,
    isConvertClassicToCloudySupported: boolean,
    isConvertCloudyToClassicSupported: boolean,
    isMoveAttachmentToInlineSupported: boolean
): AttachmentFullViewStrategy {
    return {
        ...attachmentViewStrategy,
        isSaveToCloudSupported: isSaveToCloudSupported,
        isOpeningByLinkSupported: isCloudyOrLink,
        isOpeningInProviderSupported: isOpeningInProviderSupported,
        isViewingInProviderSupported: isViewingInProviderSupported,
        isConvertClassicToCloudySupported: isConvertClassicToCloudySupported,
        isConvertCloudyToClassicSupported: isConvertCloudyToClassicSupported,
        isMoveAttachmentToInlineSupported: isMoveAttachmentToInlineSupported,
        showActionsMenu: true,
        supportedMenuActions: [],
    };
}
