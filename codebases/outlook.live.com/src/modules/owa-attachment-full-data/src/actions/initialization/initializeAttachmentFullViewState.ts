import { createAttachmentFullViewStrategy } from './createAttachmentFullViewStrategy';
import initializeSaveToCloudStatus from './initializeSaveToCloudStatus';
import type AttachmentFullViewState from '../../schema/AttachmentFullViewState';
import AttachmentMenuAction from '../../schema/AttachmentMenuAction';
import isCloudyAttachment from 'owa-attachment-model-store/lib/utils/isCloudyAttachment';
import type AttachmentType from 'owa-service/lib/contract/AttachmentType';
import type ReferenceAttachment from 'owa-service/lib/contract/ReferenceAttachment';
import {
    AttachmentPolicyInfo,
    getAttachmentPolicyInfo,
    getUserAttachmentPolicyChecker,
} from 'owa-attachment-policy';
import { AttachmentModel, isSmimeAttachmentType } from 'owa-attachment-model-store';
import { TypeOfAttachment, getTypeOfAttachment } from 'owa-attachment-type';
import { action } from 'satcheljs/lib/legacy';

// The default supported menu actions are all the available actions
let defaultSupportedMenuActions = null;
export function getDefaultSupportedMenuAction(): AttachmentMenuAction[] {
    if (!defaultSupportedMenuActions) {
        defaultSupportedMenuActions = Object.keys(AttachmentMenuAction).reduce((agg, action) => {
            const value = AttachmentMenuAction[action];
            if (Number.isInteger(value)) {
                agg.push(value);
            }
            return agg;
        }, []);
    }

    return defaultSupportedMenuActions;
}

export default action('initializeAttachmentFullViewState')(
    function initializeAttachmentFullViewState(
        attachmentViewState: AttachmentFullViewState,
        attachmentModel: AttachmentModel,
        treatLinksAsAttachments: boolean,
        supportedMenuActions?: AttachmentMenuAction[],
        isSMIMEItem?: boolean,
        isProtectedVoiceMail?: boolean
    ) {
        if (!supportedMenuActions || supportedMenuActions.length === 0) {
            supportedMenuActions = getSupportedMenuActions(attachmentModel.model);
        }

        // Initialize strategy
        const attachmentPolicyInfo: AttachmentPolicyInfo = getAttachmentPolicyInfo(
            attachmentModel.model,
            true
        );
        const attachmentPolicyChecker = getUserAttachmentPolicyChecker();
        const isCloudy = isCloudyAttachment(attachmentModel);

        const strategy = createAttachmentFullViewStrategy(
            attachmentPolicyChecker,
            attachmentPolicyInfo,
            attachmentModel.attachmentClass,
            attachmentModel.model,
            isCloudy ? (<ReferenceAttachment>attachmentModel.model).ProviderType : null,
            attachmentModel.model.AttachmentOriginalUrl,
            attachmentModel.info.allowDownload,
            supportedMenuActions,
            attachmentViewState.isReadOnly,
            treatLinksAsAttachments,
            isSMIMEItem,
            isProtectedVoiceMail
        );

        attachmentViewState.strategy = strategy;

        // Initialize the attachment view state
        initializeSaveToCloudStatus(
            attachmentViewState,
            attachmentModel,
            attachmentViewState.strategy.isSaveToCloudSupported
        );
    }
);

function getSupportedMenuActions(attachment: AttachmentType): AttachmentMenuAction[] {
    return isSmimeAttachmentType(attachment)
        ? getSmimeSupportedMenuActions(attachment)
        : getDefaultSupportedMenuAction();
}

/**
 * For S/MIME item attachments, we support both preview and download
 * For S/MIME file attachments, we support download
 * @param attachment
 */
function getSmimeSupportedMenuActions(attachment: AttachmentType): AttachmentMenuAction[] {
    return getTypeOfAttachment(attachment) === TypeOfAttachment.Mail
        ? [AttachmentMenuAction.Preview, AttachmentMenuAction.Download]
        : [AttachmentMenuAction.Download];
}
